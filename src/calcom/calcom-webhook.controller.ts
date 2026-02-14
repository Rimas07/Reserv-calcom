import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('webhooks')
export class CalcomWebhookController {
  private readonly logger = new Logger(CalcomWebhookController.name);

  constructor(private configService: ConfigService) {}

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

    return res.status(200).json({ received: true });
  }
}
