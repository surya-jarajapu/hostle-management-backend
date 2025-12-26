import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';

import { validateUUID } from 'src/global_utils/CommonUtils';
import {
  stringMandatory,
  stringOptional,
} from 'src/global_utils/zod/zod_utils';
import { GlobalZodValidationPipe } from 'src/global_utils/zod/zod_validation.pipe';

import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { HostelService } from './hostel.service';

// --------------------------------------
// SCHEMA
// --------------------------------------
export const HostelSchema = z.object({
  name: stringMandatory('Hostel Name', 3, 150),
  address: stringOptional('Address', 0, 300),
});

export type HostelDTO = z.infer<typeof HostelSchema>;

// --------------------------------------
// CONTROLLER
// --------------------------------------
@Controller('hostel')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class HostelController {
  constructor(private readonly service: HostelService) {}

  // CREATE HOSTEL (SUPER ADMIN / SYSTEM)
  @Post()
  create(@Body(new GlobalZodValidationPipe(HostelSchema)) dto: HostelDTO) {
    return this.service.create_update(dto);
  }

  // UPDATE HOSTEL
  @Patch(':id')
  update(
    @Param('id') hostel_id: string,
    @Body(new GlobalZodValidationPipe(HostelSchema)) dto: HostelDTO,
  ) {
    validateUUID(hostel_id);
    return this.service.create_update(dto, hostel_id);
  }

  // LIST HOSTELS (OPTIONAL – SYSTEM VIEW)
  @Post('search')
  find() {
    return this.service.find();
  }

  // DELETE HOSTEL
  @Delete(':id')
  delete(@Param('id') hostel_id: string, @Req() req) {
    validateUUID(hostel_id);
    return this.service.delete(hostel_id);
  }
}
