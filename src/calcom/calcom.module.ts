import { Module } from '@nestjs/common';
import { CalcomWebhookController } from './calcom-webhook.controller.js';

@Module({
  controllers: [CalcomWebhookController],
})
export class CalcomModule {}
