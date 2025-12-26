import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  buildIn,
  buildInclude,
  buildOrderBy,
  search,
} from 'src/global_utils/PrismaUtils';

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

import { formatDBDateTime } from 'src/global_utils/DateUtils';

import { MasterUser, Prisma } from 'prisma/generated';
import { PAGING } from 'src/global_utils/EnumsBase';

import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
import { MasterUserDTO, MasterUserQueryDTO } from './masterUser.controller';
import { Role } from '@prisma/client';

const name = `MasterUser`;

@Injectable()
export class MasterUserService {
  constructor(private prisma: PrismaPostgrePBService) {}

  // -----------------------------------------
  // CREATE OR UPDATE
  // -----------------------------------------
async create_update(
  dto: MasterUserDTO,
  master_user_id: string = '',
  authUser: any, // 👈 from JWT
): Promise<BR> {
  if (master_user_id) {
    const existing = await this.findOneById(master_user_id);
    if (!existing) {
      return errorBR(master_user_id, name, `${name} not found.`);
    }
  }

  try {
    const data: Prisma.MasterUserCreateInput = {
      name: dto.name,
      email: dto.email,
      mobile: dto.mobile,           // ✅ FIXED
      password: dto.password,
      role: dto.role,

      // 🔐 HOSTEL IS ALWAYS FROM BACKEND
      hostel: {
        connect: {
          hostel_id: authUser.hostel_id,
        },
      },
    };

    let result: MasterUser;

    if (master_user_id) {
      result = await this.prisma.masterUser.update({
        where: { master_user_id },
        data,
      });
    } else {
      result = await this.prisma.masterUser.create({ data });
    }

    return successBR(master_user_id, name, result);
  } catch (error) {
    if (error?.code === 'P2002') {
      return errorBR(master_user_id, name, 'Email or Mobile already exists.');
    }
    return errorBR(master_user_id, name, error?.message);
  }
}


  // -----------------------------------------
  // FIND MANY
  // -----------------------------------------
  async find(dto: MasterUserQueryDTO): Promise<FBR> {
    try {
      const where: any = {
        ...buildIn('role', dto.masterroles),
        ...search(['name', 'email'], dto.search),
      };

      const include = buildInclude(dto, [], []);

      const orderBy = buildOrderBy(dto.order_by);

      const totalCount = await this.prisma.masterUser.count({ where });

      const take = dto.paging === PAGING.Yes ? dto.page_count : totalCount;
      const skip = dto.paging === PAGING.Yes ? dto.page_index * take : 0;

      const rows = await this.prisma.masterUser.findMany({
        where,
        // include
        take,
        skip,
        orderBy,
      });

      const rows_ = rows.map((r) => ({
        ...r,
        added_date_time: formatDBDateTime(r.added_date_time),
        modified_date_time: formatDBDateTime(r.modified_date_time),
      }));

      return successFBR(totalCount, take, skip, dto.page_index, rows_);
    } catch (error) {
      return errorFBR(error?.message);
    }
  }

  // -----------------------------------------
  // DELETE
  // -----------------------------------------
  async delete(master_user_id: string,authUser: any,): Promise<DBR> {
    const row = await this.findOneById(master_user_id);
    if (!row) return errorDBR_notfound(name);

    try {
      await this.prisma.masterUser.delete({ where: { master_user_id } });
      return successDBR(name);
    } catch (error) {
      return errorDBR(name, error?.message);
    }
  }

  // -----------------------------------------
  // FIND ONE
  // -----------------------------------------
  async findOneById(master_user_id: string) {
    return await this.prisma.masterUser.findUnique({
      where: { master_user_id },
    });
  }
}
