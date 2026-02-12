import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Response } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({ origin: true, credentials: true });
  app.useStaticAssets(join(process.cwd(), 'public'));

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (_req: any, res: Response) => res.redirect('/index.html'));

  const config = new DocumentBuilder()
    .setTitle('Rezervachka - Online Booking')
    .setDescription('API for urology clinic appointment booking system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = configService.get<number>('server.port') || 3000;
  await app.listen(port);

  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`API docs: http://localhost:${port}/api`);
  logger.log(`Booking: http://localhost:${port}/booking.html`);
  logger.log(`Admin: http://localhost:${port}/admin.html`);
}
bootstrap();
