import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminDashboardService } from './admin-dashboard.service';
import { GlobalZodValidationPipe } from 'src/global_utils/zod/zod_validation.pipe';
import { CollectFeeDTO } from '../user/user.controller';
import { validateUUID } from 'src/global_utils/CommonUtils';

@Controller('admin/dashboard')
@UseGuards(AuthGuard('jwt'))
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  // -----------------------------
  // DASHBOARD STATS
  // -----------------------------
  @Get()
  getStats(@Req() req: any) {
    return this.service.getStats(req.user);
  }

  // -----------------------------
  // PARTIAL USERS
  // -----------------------------
  @Get('partial-users')
  getPartialUsers(@Req() req: any) {
    return this.service.getPartialUsers(req.user);
  }

  // -----------------------------
  // OVERDUE USERS
  // -----------------------------
  @Get('overdue-users')
  getOverdueUsers(@Req() req: any) {
    return this.service.getOverdueUsers(req.user);
  }

  // -----------------------------
  // AVAILABLE BEDS
  // -----------------------------
  @Get('available-beds')
  getAvailableBeds(@Req() req: any) {
    return this.service.getAvailableBeds(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('users/:id/approve-fee')
  approveFee(@Param('id') user_id: string) {
    validateUUID(user_id);
    return this.service.approvePayment(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('pending-collections')
  getPendingCollections(@Req() req: any) {
    return this.service.getPendingCollections(req.user);
  }
}
