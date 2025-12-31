import { Injectable } from '@nestjs/common';
import { BR, errorBR, successBR } from 'src/global_utils/BaseResponse';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
const name = `User`;
@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaPostgrePBService) {}

  // -----------------------------
  // DASHBOARD STATS (HOSTEL BASED)
  // -----------------------------
async getStats(authUser: any) {
  const hostel_id = authUser.hostel_id;
  const now = new Date();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    total_users,
    partial_users,
    overdue_users,
    pending_list,
    rooms,
    collected,
  ] = await Promise.all([
    this.prisma.user.count({ where: { hostel_id } }),

    this.prisma.user.count({
      where: {
        hostel_id,
        due_amount: { gt: 0 },
        next_fee_date: { gte: now },
      },
    }),

    this.prisma.user.count({
      where: {
        hostel_id,
        due_amount: { gt: 0 },
        next_fee_date: { lt: now },
      },
    }),

    this.prisma.user.count({
      where: {
        hostel_id,
        payment_status: 'PENDING',
      },
    }),

    // 👇 lighter query (no users array)
    this.prisma.room.findMany({
      where: { hostel_id },
      select: {
        total_beds: true,
        _count: {
          select: { users: true },
        },
      },
    }),

    this.prisma.user.aggregate({
      _sum: { monthly_fee: true },
      where: {
        hostel_id,
        due_amount: 0,
        modified_date_time: { gte: startOfMonth },
      },
    }),
  ]);

  const available_beds = rooms.reduce(
    (sum, r) => sum + (r.total_beds - r._count.users),
    0,
  );

  return {
    status: true,
    data: {
      total_users,
      partial_users,
      overdue_users,
      pending_list,
      available_beds,
      collected_this_month: collected._sum.monthly_fee ?? 0,
    },
  };
}


  // -----------------------------
  // PARTIAL USERS
  // -----------------------------
  async getPartialUsers(authUser: any) {
    const hostel_id = authUser.hostel_id;

    const rows = await this.prisma.user.findMany({
      where: {
        hostel_id,
        due_amount: { gt: 0 },
        next_fee_date: { gte: new Date() },
      },
      include: {
        room: { select: { room_number: true } },
      },
    });

    return {
      status: true,
      data: rows.map((u) => ({
        ...u,
        delay_days: this.calculateDelayDays(u.next_fee_date),
      })),
    };
  }

  // -----------------------------
  // OVERDUE USERS
  // -----------------------------
  async getOverdueUsers(authUser: any) {
    const hostel_id = authUser.hostel_id;

    const rows = await this.prisma.user.findMany({
      where: {
        hostel_id,
        due_amount: { gt: 0 },
        next_fee_date: { lt: new Date() },
      },
      include: {
        room: { select: { room_number: true } },
      },
    });

    return {
      status: true,
      data: rows.map((u) => ({
        ...u,
        delay_days: this.calculateDelayDays(u.next_fee_date),
      })),
    };
  }

  // -----------------------------
  // AVAILABLE BEDS
  // -----------------------------
async getAvailableBeds(authUser: any) {
  const hostel_id = authUser.hostel_id;

  const rooms = await this.prisma.room.findMany({
    where: { hostel_id },
    select: {
      room_id: true,
      room_number: true,
      total_beds: true,
      _count: { select: { users: true } },
    },
  });

  return {
    status: true,
    data: rooms.map((r) => ({
      room_id: r.room_id,
      room_number: r.room_number,
      available_beds: r.total_beds - r._count.users,
    })),
  };
}


  // -----------------------------------------
  // PENDING COLLECTION LIST
  // -----------------------------------------
  // -----------------------------------------
  // PENDING COLLECTION LIST
  // -----------------------------------------
async getPendingCollections(authUser: any) {
  const hostel_id = authUser.hostel_id;

  const users = await this.prisma.user.findMany({
    where: {
      hostel_id,
      payment_status: 'PENDING',
    },
    select: {
      user_id: true,
      user_name: true,
      due_amount: true,
      next_fee_date: true,
      room: {
        select: {
          room_number: true,
          floor_number: true,
        },
      },
    },
    orderBy: {
      modified_date_time: 'desc',
    },
  });

  return {
    status: true,
    data: users.map((u) => ({
      ...u,
      delay_days: this.calculateDelayDays(u.next_fee_date),
    })),
  };
}


  async approvePayment(user_id: string): Promise<BR> {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      return errorBR(user_id, name, 'User not found');
    }

    // already approved
    if (user.payment_status === 'APPROVED') {
      return errorBR(user_id, name, 'Payment already approved');
    }

    // nothing to approve
    if (user.payment_status !== 'PENDING') {
      return errorBR(user_id, name, 'No pending payment to approve');
    }

    const updated = await this.prisma.user.update({
      where: { user_id },
      data: {
        payment_status: 'APPROVED',
      },
    });

    return successBR(user_id, name, updated);
  }

  // -----------------------------
  // HELPER
  // -----------------------------
  private calculateDelayDays(date: Date | null) {
    if (!date || date >= new Date()) return 0;
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }
}
