import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated';

@Injectable()
export class PrismaPostgrePBService
  extends PrismaClient
  implements OnModuleInit
{
  onModuleInit() {
    this.$connect()
      .then(() => console.log('Connected to postgre_rpt_db'))
      .catch((err) => console.log(err));
  }
}
