import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { GlobalZodValidationPipe } from 'src/global_utils/zod/zod_validation.pipe';
import { validateUUID } from 'src/global_utils/CommonUtils';

import { RoomService } from './room.service';

import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  stringOptional,
} from 'src/global_utils/zod/zod_utils';
import { BaseQuerySchema } from 'src/global_utils/zod/zod_base_schema';
import { MasterRole, Status } from 'prisma/generated';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

export const RoomSchema = z.object({
  room_number: stringMandatory('Room Number', 1, 20),
  total_beds: z.number().min(1, 'Total beds must be at least 1'),
  status: enumMandatory('Status', Status, Status.Active),
  floor_number: stringOptional('Floor Number', 0, 100),
  hostel_id: stringOptional('Hostel'),
});

export type RoomDTO = z.infer<typeof RoomSchema>;
export const RoomQuerySchema = BaseQuerySchema;
export type RoomQueryDTO = z.infer<typeof RoomQuerySchema>;

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
@Controller('room')
// @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(MasterRole.ADMIN, MasterRole.SUPERVISOR)
export class RoomController {
  constructor(private readonly service: RoomService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body(new GlobalZodValidationPipe(RoomSchema)) dto: RoomDTO,
    @Req() req: any,
  ) {
    return this.service.create_update(dto, req.user);
  }

  // UPDATE ROOM
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new GlobalZodValidationPipe(RoomSchema)) dto: RoomDTO,
    @Req() req: any,
  ) {
    validateUUID(id);
    return this.service.create_update(dto, req.user, id);
  }

  // SEARCH ROOMS
  @UseGuards(AuthGuard('jwt'))
  @Post('search')
  find(
    @Body(new GlobalZodValidationPipe(RoomQuerySchema)) query: RoomQueryDTO,
    @Req() req: any,
  ) {
    return this.service.find(query, req.user);
  }

  // DELETE ROOM
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteRoom(@Param('id') roomId: string, @Req() req: any) {
    validateUUID(roomId);
    return this.service.delete(roomId, req.user);
  }

  @Get('available')
  findAvailableRooms() {
    return this.service.findAvailableRooms();
  }
}
