process.env.TZ = 'Asia/Kolkata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import cors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 30 * 1024 * 1024,
    }),
  );

  // Security headers
  await app.register(helmet, { contentSecurityPolicy: false });

  // CORS (frontend connection)
  await app.register(cors, {
    origin: [
      'http://localhost:3000',
      'https://your-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Compression
  await app.register(compression);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
