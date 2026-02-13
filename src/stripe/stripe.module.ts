import { Module, forwardRef } from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import { StripeController } from './stripe.controller.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { SlotsModule } from '../slots/slots.module.js';

@Module({
  imports: [forwardRef(() => AppointmentsModule), SlotsModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
