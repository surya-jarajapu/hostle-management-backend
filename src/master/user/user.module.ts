import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/module';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';

@Module({
  imports: [AuthModule],       // ⭐ FIX: Give access to JwtService + guards
  controllers: [UserController],
    providers: [UserService, PrismaPostgrePBService],
  exports: [UserService],
})
export class UserModule {}
