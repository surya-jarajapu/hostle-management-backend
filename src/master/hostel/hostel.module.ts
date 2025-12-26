import { Module } from '@nestjs/common';
import { HostelController } from './hostel.controller';
// import { AuthModule } from 'src/auth/module';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';
import { HostelService } from './hostel.service';

@Module({
  // imports: [AuthModule],
  controllers: [HostelController],
  providers: [HostelService, PrismaPostgrePBService],
  exports: [HostelService]
})
export class HostelModule {}
