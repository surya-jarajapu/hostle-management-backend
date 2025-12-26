import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/module';
import { MasterModule } from './master/master.module';
import { UserModule } from './master/user/user.module';

import { masterUserModule } from './master/masterUser/masterUser.module';
import { AdminDashboardModule } from './master/admin_dashboard/admin-dashboard.module';
import { HostelModule } from './master/hostel/hostel.module';

@Module({
  imports: [
    RouterModule.register([]),
    AuthModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MasterModule,
    UserModule,
    masterUserModule,
    AdminDashboardModule,
    HostelModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // 1️⃣ Global JWT Auth Guard
  ],
})
export class AppModule {}
