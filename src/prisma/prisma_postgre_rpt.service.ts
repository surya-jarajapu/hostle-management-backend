import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/client';

@Injectable()
export class PrismaPostgrePBService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
