import { Module } from '@nestjs/common';
import { CalcomWebhookController } from './calcom-webhook.controller.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';

@Module({
  imports: [AppointmentsModule],
  controllers: [CalcomWebhookController],
})
export class CalcomModule {}
