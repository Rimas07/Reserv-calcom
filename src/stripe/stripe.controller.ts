import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Logger,
} from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import { AppointmentsService } from '../appointments/appointments.service.js';
import { SlotsService } from '../slots/slots.service.js';

@Controller('webhooks')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private stripeService: StripeService,
    private appointmentsService: AppointmentsService,
    private slotsService: SlotsService,
  ) {}

  @Post('stripe')
  async handleWebhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    let event;
    try {
      event = this.stripeService.constructEvent(
        (req as any).rawBody,
        signature,
      );
    } catch (err: any) {
      this.logger.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const appointmentId = session.metadata?.appointmentId;

      if (appointmentId) {
        try {
          await this.appointmentsService.confirmPayment(appointmentId);
          this.logger.log(`Payment confirmed for appointment ${appointmentId}`);
        } catch (err: any) {
          this.logger.error(`Error confirming payment: ${err.message}`);
        }
      }
    }

    return res.status(200).json({ received: true });
  }
}
