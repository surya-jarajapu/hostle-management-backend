process.env.TZ = 'Asia/Kolkata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // 🔥 REQUIRED
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 30 * 1024 * 1024, // 30 MB
    }),
  );

  // Security headers
  await app.register(helmet, { contentSecurityPolicy: false });

  // CORS
  await app.register(fastifyCors, {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Compression
  await app.register(compression);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
}

bootstrap();
