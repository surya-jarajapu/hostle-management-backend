import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';

import {
  BR,
  DBR,
  errorBR,
  errorDBR,
  errorDBR_notfound,
  successBR,
  successDBR,
  successFBR,
} from 'src/global_utils/BaseResponse';

import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
import { HostelDTO } from './hostel.controller';

const name = 'Hostel';

@Injectable()
export class HostelService {
  constructor(private prisma: PrismaPostgrePBService) {}

  // -----------------------------------------
  // CREATE OR UPDATE
  // -----------------------------------------
async create_update(
  dto: HostelDTO,
  hostel_id: string = '',
): Promise<BR> {
  try {
    // 🔹 Update case: check hostel exists
    if (hostel_id) {
      const existing = await this.prisma.hostel.findUnique({
        where: { hostel_id },
      });

      if (!existing) {
        return errorBR(hostel_id, 'Hostel', 'Hostel not found');
      }
    }

    // 🔹 Create case: check duplicate hostel name
    if (!hostel_id) {
      const alreadyExists = await this.prisma.hostel.findFirst({
        where: {
          name: dto.name,
        },
      });

      if (alreadyExists) {
        return errorBR('', 'Hostel', 'Hostel already created');
      }
    }

    const data: Prisma.HostelCreateInput = {
      name: dto.name,
      address: dto.address ?? null,
    };

    const result = hostel_id
      ? await this.prisma.hostel.update({
          where: { hostel_id },
          data,
        })
      : await this.prisma.hostel.create({
          data,
        });

    return successBR(hostel_id, 'Hostel', result);
  } catch (error: any) {
    return errorBR(hostel_id, 'Hostel', error.message);
  }
}



  // -----------------------------------------
  // FIND ALL HOSTELS
  // -----------------------------------------
  async find() {
    try {
      const rows = await this.prisma.hostel.findMany({
        orderBy: { added_date_time: 'desc' },
      });

      return successFBR(rows.length, rows.length, 0, 0, rows);
    } catch (error) {
      return errorDBR(name, error?.message);
    }
  }

  // -----------------------------------------
  // DELETE HOSTEL
  // -----------------------------------------
async delete(hostel_id: string): Promise<DBR> {
  const exists = await this.prisma.hostel.findUnique({
    where: { hostel_id },
    include: {
      masterUsers: true,
      users: true,
      rooms: true,
    },
  });

  if (!exists) return errorDBR_notfound(name);

  if (
    exists.masterUsers.length > 0 ||
    exists.users.length > 0 ||
    exists.rooms.length > 0
  ) {
    return errorDBR(
      name,
      'Cannot delete hostel. Remove users, rooms, and master users first.',
    );
  }

  await this.prisma.hostel.delete({ where: { hostel_id } });
  return successDBR(name);
}

}
