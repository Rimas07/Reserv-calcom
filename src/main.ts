import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  app.enableCors({ origin: true, credentials: true });
  app.useStaticAssets(join(process.cwd(), 'public'));

  const port = configService.get<number>('server.port') || 3000;
  await app.listen(port);

  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`Cal.com webhook: POST http://localhost:${port}/webhooks/calcom`);
}
bootstrap();
