import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'master',
        children: [
          // { path: 'playground', module: PlaygroundModule },
          // { path: 'booking', module: BookingModule },
          // { path: 'court', module: CourtModule },
          // { path: 'booking', module: BookingModule },
        ],
      },
    ]),

    UserModule,

    RoomModule,
  ],
})
export class MasterModule {}
