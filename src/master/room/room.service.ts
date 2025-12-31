import { Injectable } from '@nestjs/common';
import { Prisma, Room, User } from 'prisma/generated';

import { buildInclude, buildOrderBy } from 'src/global_utils/PrismaUtils';

import {
  BR,
  DBR,
  FBR,
  errorBR,
  errorDBR_notfound,
  errorFBR,
  successBR,
  successDBR,
  successFBR,
} from 'src/global_utils/BaseResponse';

import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
import { RoomDTO, RoomQueryDTO } from './room.controller';

const name = 'Room';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaPostgrePBService) {}

  // -----------------------------------------
  // CREATE OR UPDATE
  // -----------------------------------------
  async create_update(
    dto: RoomDTO,
    authUser: any,
    room_id: string = '',
  ): Promise<BR> {
    const entity = 'Room';

    // 🔹 Basic validations
    if (!dto.room_number) {
      return errorBR(room_id, entity, 'Room number is required');
    }

    if (!dto.total_beds || dto.total_beds <= 0) {
      return errorBR(room_id, entity, 'Total beds must be greater than 0');
    }

    if (!dto.status) {
      return errorBR(room_id, entity, 'Room status is required');
    }

    // 🔹 Update validation
    if (room_id) {
      const existing = await this.findOneById(room_id, authUser);
      if (!existing) {
        return errorBR(room_id, entity, 'Room not found');
      }
    }

    try {
      // 🔹 Ensure hostel exists (extra safety)
      const hostelExists = await this.prisma.hostel.findUnique({
        where: { hostel_id: authUser.hostel_id },
      });

      if (!hostelExists) {
        return errorBR(
          room_id,
          entity,
          'Hostel not found. Please login again.',
        );
      }

      const data: Prisma.RoomCreateInput = {
        room_number: dto.room_number,
        total_beds: dto.total_beds,
        status: dto.status,
        floor_number: dto.floor_number,

        hostel: {
          connect: {
            hostel_id: authUser.hostel_id, // 🔐 SAFE & CORRECT
          },
        },
      };

      const result = room_id
        ? await this.prisma.room.update({
            where: { room_id },
            data,
          })
        : await this.prisma.room.create({ data });

      return successBR(room_id, entity, result);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return errorBR(
          room_id,
          entity,
          'Room number already exists in this hostel',
        );
      }
      return errorBR(room_id, entity, error.message);
    }
  }

  // SEARCH ROOMS
async find(dto: RoomQueryDTO, authUser: any): Promise<FBR> {
  try {
    const rooms = await this.prisma.room.findMany({
      where: {
        hostel_id: authUser.hostel_id,
      },
      select: {
        room_id: true,
        room_number: true,
        floor_number: true,
        total_beds: true,
        status: true,
        addedAt: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: [
        { status: 'asc' },
        { addedAt: 'desc' },
      ],
    });

    const rows = rooms.map((r) => ({
      ...r,
      used_beds: r._count.users,
      available_beds: r.total_beds - r._count.users,
    }));

    return successFBR(rows.length, rows.length, 0, 0, rows);
  } catch (error: any) {
    return errorFBR(error.message);
  }
}


  // DELETE
  async delete(roomId: string, authUser: any): Promise<DBR> {
    const exists = await this.prisma.room.findFirst({
      where: {
        room_id: roomId,
        hostel_id: authUser.hostel_id,
      },
    });

    if (!exists) return errorDBR_notfound(name);

    await this.prisma.room.delete({ where: { room_id: roomId } });
    return successDBR(name);
  }

  // FIND ONE
  async findOneById(room_id: string, authUser: any) {
    return this.prisma.room.findFirst({
      where: {
        room_id,
        hostel_id: authUser.hostel_id,
      },
    });
  }

  // GET ONLY ROOMS WITH FREE BEDS
  async findAvailableRooms() {
    const rooms = await this.prisma.room.findMany({
      where: { status: 'Active' },
      include: {
        users: {
          select: { user_id: true },
        },
      },
    });

    const availableRooms = rooms
      .map((r) => ({
        room_id: r.room_id,
        room_number: r.room_number,
        total_beds: r.total_beds,
        available_beds: r.total_beds - r.users.length,
      }))
      .filter((r) => r.available_beds > 0);

    return {
      status: true,
      message: 'Available rooms fetched successfully',
      data: availableRooms, // ✅ ARRAY
      error: '',
    };
  }
}
