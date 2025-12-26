import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaPostgrePBService } from 'src/prisma/prisma_postgre_rpt.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaPostgrePBService],
  exports: [RoomService],
})
export class RoomModule {}
