import { Global, Module } from '@nestjs/common';
import { PrismaPostgrePBService } from './prisma_postgre_rpt.service';

@Global()
@Module({
  providers: [PrismaPostgrePBService],
  exports: [PrismaPostgrePBService],
})
export class PrismaModule {}
