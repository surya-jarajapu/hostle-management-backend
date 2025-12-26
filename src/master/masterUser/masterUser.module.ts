import { Module } from '@nestjs/common';
import { MasterUserController } from './masterUser.controller';
import { MasterUserService } from './masterUser.service';
// import { AuthModule } from 'src/auth/module';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';

@Module({
  // imports: [AuthModule],
  controllers: [MasterUserController],
  providers: [MasterUserService, PrismaPostgrePBService],
  exports: [MasterUserService]
})
export class masterUserModule {}
