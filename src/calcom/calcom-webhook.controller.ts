import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppointmentsService } from '../appointments/appointments.service.js';
import * as crypto from 'crypto';

@Controller('webhooks')
export class CalcomWebhookController {
  private readonly logger = new Logger(CalcomWebhookController.name);

  constructor(
    private appointmentsService: AppointmentsService,
    private configService: ConfigService,
  ) {}

  @Post('calcom')
  async handleWebhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('x-cal-signature-256') signature: string,
  ) {
    const secret = this.configService.get<string>('calcom.webhookSecret');

    // Verify webhook signature if secret is configured
    if (secret && signature) {
      const rawBody =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const expected =
        'sha256=' +
        crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (signature !== expected) {
        this.logger.error('Cal.com webhook signature verification failed');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const payload = req.body;
    const triggerEvent = payload.triggerEvent;

    this.logger.log(`Cal.com webhook received: ${triggerEvent}`);

    try {
      switch (triggerEvent) {
        case 'BOOKING_CREATED': {
          const booking = payload.payload;
          await this.appointmentsService.createFromCalcom({
            calcomBookingId: String(booking.bookingId || booking.id),
            calcomBookingUid: booking.uid,
            patientName: booking.responses?.name?.value || booking.attendees?.[0]?.name || '',
            email: booking.responses?.email?.value || booking.attendees?.[0]?.email || '',
            phone: booking.responses?.phone?.value || '',
            insurance: booking.responses?.insurance?.value || '',
            birthDate: booking.responses?.birthDate?.value || '',
            description: booking.responses?.notes?.value || booking.description || '',
            serviceName: booking.eventType?.title || booking.title || '',
            doctorName: booking.organizer?.name || '',
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: 'confirmed',
          });
          this.logger.log(`Booking created: ${booking.uid}`);
          break;
        }

        case 'BOOKING_CANCELLED': {
          const booking = payload.payload;
          const uid = booking.uid;
          await this.appointmentsService.cancelByCalcomUid(uid);
          this.logger.log(`Booking cancelled: ${uid}`);
          break;
        }

        case 'BOOKING_RESCHEDULED': {
          const booking = payload.payload;
          await this.appointmentsService.rescheduleByCalcomUid(
            booking.rescheduleUid || booking.uid,
            {
              startTime: booking.startTime,
              endTime: booking.endTime,
              calcomBookingUid: booking.uid,
            },
          );
          this.logger.log(`Booking rescheduled: ${booking.uid}`);
          break;
        }

        default:
          this.logger.warn(`Unhandled cal.com event: ${triggerEvent}`);
      }
    } catch (err: any) {
      this.logger.error(`Error processing cal.com webhook: ${err.message}`);
    }

    return res.status(200).json({ received: true });
  }
}
