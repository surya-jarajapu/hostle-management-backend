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

import {
  enumMandatory,
  multi_select_optional,
  numberMandatory,
  numberOptional,
  stringMandatory,
  stringOptional,
} from 'src/global_utils/zod/zod_utils';

import { validateUUID } from 'src/global_utils/CommonUtils';
import { BaseQuerySchema } from 'src/global_utils/zod/zod_base_schema';
import { GlobalZodValidationPipe } from 'src/global_utils/zod/zod_validation.pipe';

import { Status } from 'prisma/generated';
import { UserService } from './user.service';

// Auth + Roles
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

// --------------------------------------
// SCHEMAS
// --------------------------------------
export const UserSchema = z.object({
  user_name: stringMandatory('User Name', 3, 100),

  email: stringMandatory('Email', 5, 150),

  mobile: stringMandatory('Mobile', 10, 20),

  monthly_fee: numberMandatory('Monthly Fee'),

  room_id: stringOptional('Room'),
  joining_date: stringOptional('Joining Date'),

  user_fee_receipt: stringOptional('User Fee Receipt'),

  status: enumMandatory('Status', Status, Status.Active),

  payment_type: z.enum(['NONE', 'FULL', 'PARTIAL']).default('NONE'),

  paid_amount: numberOptional('Paid Amount'),
});

export type UserDTO = z.infer<typeof UserSchema>;

export type UserQueryDTO = z.infer<typeof UserQuerySchema>;

export const UserQuerySchema = BaseQuerySchema.extend({
  roles: multi_select_optional('Role'),
});

const CollectFeeSchema = z.object({
  amount: z.number().min(1),
  type: z.enum(['FULL', 'PARTIAL']),
});

export type CollectFeeDTO = z.infer<typeof CollectFeeSchema>;

// --------------------------------------
// CONTROLLER
// --------------------------------------
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly _service: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: UserDTO, @Req() req) {
    return this._service.create_update(dto, req.user);
  }

  @Post('search')
  find(
    @Body(new GlobalZodValidationPipe(UserQuerySchema)) query: UserQueryDTO,
    @Req() req: any,
  ) {
    return this._service.find(query, req.user); // ✅
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') user_id: string, @Body() dto: UserDTO, @Req() req) {
    return this._service.create_update(dto, req.user, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') user_id: string) {
    return this._service.delete(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/collect-fee')
  collectFee(
    @Param('id') user_id: string,
    @Body(new GlobalZodValidationPipe(CollectFeeSchema))
    dto: CollectFeeDTO,
  ) {
    validateUUID(user_id);
    return this._service.collectFee(user_id, dto);
  }

  
}
