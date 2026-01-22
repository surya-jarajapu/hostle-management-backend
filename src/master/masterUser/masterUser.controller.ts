import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Req } from '@nestjs/common';
import { MasterRole, Status } from 'prisma/generated';
import { Roles } from 'src/auth/roles.decorator';

// Auth + Roles
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { validateUUID } from 'src/global_utils/CommonUtils';
import { BaseQuerySchema } from 'src/global_utils/zod/zod_base_schema';
import { enumMandatory, multi_select_optional, stringMandatory } from 'src/global_utils/zod/zod_utils';
import { GlobalZodValidationPipe } from 'src/global_utils/zod/zod_validation.pipe';
import z from 'zod';
import { MasterUserService } from './masterUser.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

// --------------------------------------
// SCHEMAS
// --------------------------------------
export const MasterUserSchema = z.object({
  name: stringMandatory('Name', 3, 100),
  email: stringMandatory('Email', 5, 150),
  password: stringMandatory('Password', 3, 100),
  mobile: stringMandatory('Mobile', 2, 10),
  role: enumMandatory('MasterRole', MasterRole, MasterRole.ADMIN),
  status: enumMandatory('Status', Status, Status.Active),
});

export type MasterUserDTO = z.infer<typeof MasterUserSchema>;

export const MasterUserQuerySchema = BaseQuerySchema.extend({
  masterroles: multi_select_optional('MasterRole'),
});

export type MasterUserQueryDTO = z.infer<typeof MasterUserQuerySchema>;

// --------------------------------------
// CONTROLLER
// --------------------------------------
@Controller('master-user')
// @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(MasterRole.ADMIN) // 🔥 only ADMIN can manage master users
export class MasterUserController {
  constructor(private readonly _service: MasterUserService) {}

// @UseGuards(AuthGuard('jwt')) // 👈 REQUIRED
@Post()
create(
  @Body(new GlobalZodValidationPipe(MasterUserSchema)) dto: MasterUserDTO,
  @Req() req,
) {
  return this._service.create_update(dto, '', req.user);
}
  

  @Post('search')
  find(
    @Body(new GlobalZodValidationPipe(MasterUserQuerySchema))
    query: MasterUserQueryDTO,
  ) {
    return this._service.find(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new GlobalZodValidationPipe(MasterUserSchema)) dto: MasterUserDTO,
    @Req() req,
  ) {
    validateUUID(id);
    return this._service.create_update(dto, id, req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') master_user_id: string, @Req() req) {
    return this._service.delete(master_user_id, req.user);
  }
}
