import { BadRequestException, Injectable } from '@nestjs/common';

import {
  BR,
  DBR,
  errorBR,
  errorDBR,
  errorDBR_notfound,
  errorFBR,
  FBR,
  successBR,
  successDBR,
  successFBR,
} from 'src/global_utils/BaseResponse';

import { Prisma } from 'prisma/generated';
import { calculateDelayDays } from 'src/global_utils/delaydays/calculateDelayDays ';
import { PAGING } from 'src/global_utils/EnumsBase';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
import { CollectFeeDTO, UserDTO, UserQueryDTO } from './user.controller';

const name = `User`;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaPostgrePBService) {}

  // -----------------------------------------
  // CREATE OR UPDATE USER
  // -----------------------------------------
  async create_update(
    dto: UserDTO,
    authUser: any,
    user_id?: string,
  ): Promise<BR> {
    const entity = 'User';

    if (!authUser?.hostel_id) {
      return errorBR(user_id, entity, 'Invalid hostel context');
    }

    const addOneMonth = (date: Date) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + 1);
      return d;
    };

    // -------------------------
    // BASIC VALIDATIONS
    // -------------------------
    if (!dto.user_name?.trim()) {
      return errorBR(user_id, entity, 'User name is required');
    }

    if (!dto.monthly_fee || dto.monthly_fee <= 0) {
      return errorBR(user_id, entity, 'Monthly fee must be greater than 0');
    }

    if (!dto.status) {
      return errorBR(user_id, entity, 'User status is required');
    }

    const joining_date = dto.joining_date
      ? new Date(dto.joining_date)
      : new Date();

    // 🔑 WILL HOLD UPDATED NEXT FEE DATE
    let next_fee_date: Date | undefined;

    // -------------------------
    // UPDATE SAFETY (HOSTEL LOCK)
    // -------------------------
    if (user_id) {
      const existing = await this.prisma.user.findFirst({
        where: {
          user_id,
          hostel_id: authUser.hostel_id,
        },
      });

      if (!existing) {
        return errorBR(user_id, entity, 'User not found');
      }

      // 🔒 BLOCK JOINING DATE CHANGE AFTER PAYMENT
      if (
        dto.joining_date &&
        new Date(dto.joining_date).getTime() !==
          new Date(existing.joining_date).getTime()
      ) {
        if (existing.due_amount < existing.monthly_fee) {
          return errorBR(
            user_id,
            entity,
            'Cannot change joining date after payment',
          );
        }

        // ✅ NO PAYMENT DONE → RECALCULATE NEXT FEE
        next_fee_date = addOneMonth(new Date(dto.joining_date));
      }
    }

    try {
      let due_amount = dto.monthly_fee;

      // -------------------------
      // PAYMENT LOGIC (CREATE ONLY)
      // -------------------------
      if (!user_id) {
        if (!dto.payment_type) {
          return errorBR(user_id, entity, 'Payment type is required');
        }

        if (dto.payment_type === 'FULL') {
          due_amount = 0;
        }

        if (dto.payment_type === 'PARTIAL') {
          if (!dto.paid_amount || dto.paid_amount <= 0) {
            return errorBR(
              user_id,
              entity,
              'Paid amount is required for partial payment',
            );
          }

          if (dto.paid_amount >= dto.monthly_fee) {
            return errorBR(
              user_id,
              entity,
              'Paid amount must be less than monthly fee',
            );
          }

          due_amount = dto.monthly_fee - dto.paid_amount;
        }
      }

      // -------------------------
      // PRISMA DATA
      // -------------------------
      const data: Prisma.UserCreateInput = {
        user_name: dto.user_name.trim(),
        email: dto.email?.trim() || '',
        mobile: dto.mobile.trim(),

        joining_date,
        monthly_fee: dto.monthly_fee,
        due_amount,

        user_fee_receipt: dto.user_fee_receipt || '',
        status: dto.status,

        // ✅ CREATE
        ...(user_id ? {} : { next_fee_date: addOneMonth(joining_date) }),

        // ✅ UPDATE (only when allowed)
        ...(next_fee_date && { next_fee_date }),

        ...(dto.room_id && {
          room: { connect: { room_id: dto.room_id } },
        }),

        hostel: {
          connect: {
            hostel_id: authUser.hostel_id,
          },
        },
      };

      const result = user_id
        ? await this.prisma.user.update({
            where: { user_id },
            data,
          })
        : await this.prisma.user.create({ data });

      return successBR(user_id, entity, result);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return errorBR(user_id, entity, 'Email or mobile already exists');
      }
      return errorBR(user_id, entity, error.message);
    }
  }

  // -----------------------------------------
  // FIND USERS (HOSTEL ISOLATED)
  // -----------------------------------------
  async find(dto: UserQueryDTO, authUser: any): Promise<FBR> {
    try {
      const where: Prisma.UserWhereInput = {
        hostel_id: authUser.hostel_id,

        ...(dto.search && {
          OR: [
            { user_name: { contains: dto.search, mode: 'insensitive' } },
            { mobile: { contains: dto.search } },
            {
              room: {
                room_number: {
                  contains: dto.search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }),

        ...(dto.status
          ? Array.isArray(dto.status)
            ? { status: { in: dto.status } }
            : { status: dto.status }
          : {}),
      };

      const total = await this.prisma.user.count({ where });

      const take = dto.paging === PAGING.Yes ? dto.page_count : total;
      const skip = dto.paging === PAGING.Yes ? dto.page_index * take : 0;

      const rows = await this.prisma.user.findMany({
        where,
        include: {
          room: {
            select: {
              room_id: true,
              room_number: true,
              floor_number: true,
            },
          },
        },
        take,
        skip,
      });

      /** ✅ 1️⃣ add delay_days */
      const rowsWithDelay = rows.map((r) => ({
        ...r,
        delay_days: calculateDelayDays(r.next_fee_date),
      }));

      /** ✅ 2️⃣ sort overdue first */
      rowsWithDelay.sort((a, b) => {
        const aOverdue = a.delay_days > 0;
        const bOverdue = b.delay_days > 0;

        // 🔴 overdue users first
        if (aOverdue !== bOverdue) {
          return aOverdue ? -1 : 1;
        }

        // ⏱ higher delay first
        if (a.delay_days !== b.delay_days) {
          return b.delay_days - a.delay_days;
        }

        // 📅 newest first (fallback)
        return (
          new Date(b.added_date_time).getTime() -
          new Date(a.added_date_time).getTime()
        );
      });

      return successFBR(total, take, skip, dto.page_index, rowsWithDelay);
    } catch (error: any) {
      return errorFBR(error.message);
    }
  }

  // -----------------------------------------
  // DELETE USER
  // -----------------------------------------
  async delete(user_id: string): Promise<DBR> {
    const row = await this.findOneById(user_id);
    if (!row) return errorDBR_notfound(name);

    try {
      await this.prisma.user.delete({ where: { user_id } });
      return successDBR(name);
    } catch (error) {
      return errorDBR(name, error?.message);
    }
  }

  // -----------------------------------------
  // FIND ONE USER
  // -----------------------------------------
  async findOneById(user_id: string) {
    return this.prisma.user.findUnique({
      where: { user_id },
    });
  }

  // -----------------------------------------
  // COLLECT FEE
  // -----------------------------------------
  async collectFee(user_id: string, dto: CollectFeeDTO): Promise<BR> {
    const { amount, type } = dto;

    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) return errorBR(user_id, name, 'User not found');

    if (user.due_amount <= 0) {
      return errorBR(user_id, name, 'No due amount');
    }

    if (amount > user.due_amount) {
      return errorBR(user_id, name, 'Amount exceeds due');
    }

    if (type === 'FULL' && amount !== user.due_amount) {
      throw new BadRequestException('Full payment must clear full due');
    }

    if (type === 'PARTIAL' && amount >= user.due_amount) {
      throw new BadRequestException('Partial payment must be less than due');
    }

    if (!user.next_fee_date) {
      throw new BadRequestException('Next fee date missing');
    }

    let newDueAmount = user.due_amount - amount;
    let newNextFeeDate = user.next_fee_date;

    if (type === 'FULL') {
      const next = new Date(user.next_fee_date);
      next.setMonth(next.getMonth() + 1);
      newDueAmount = 0;
      newNextFeeDate = next;
    }

    const updated = await this.prisma.user.update({
      where: { user_id },
      data: {
        // 🔹 financial update (immediate)
        due_amount: newDueAmount,
        next_fee_date: newNextFeeDate,
        // 🔹 payment tracking
        payment_status: 'PENDING',
      },
    });

    return successBR(user_id, name, updated);
  }

}
