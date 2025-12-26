import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'HMS PRISMA APIS',
      version: '2.0.0',
      env_name: process.env.VERSION_DETAILS,
    };
  }
}
