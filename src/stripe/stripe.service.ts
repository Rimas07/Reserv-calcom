import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    this.stripe = new Stripe(secretKey || '');
  }

  async createCheckoutSession(params: {
    appointmentId: string;
    doctorName: string;
    serviceName: string;
    date: string;
    startTime: string;
    baseUrl: string;
  }) {
    const priceCzk = this.configService.get<number>('stripe.priceCzk') || 500;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: params.serviceName,
              description: `${params.doctorName} | ${params.date} ${params.startTime}`,
            },
            unit_amount: priceCzk * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${params.baseUrl}/booking.html?success=1&appointmentId=${params.appointmentId}`,
      cancel_url: `${params.baseUrl}/booking.html?cancelled=1`,
      metadata: {
        appointmentId: params.appointmentId,
      },
      expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
    });

    return session;
  }

  constructEvent(body: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    return this.stripe.webhooks.constructEvent(body, signature, webhookSecret || '');
  }
}
