import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Slot', required: true })
  slotId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop()
  birthDate?: string;

  @Prop()
  insurance?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ enum: ['confirmed', 'cancelled', 'pending', 'expired'], default: 'pending' })
  status: string;

  @Prop({ enum: ['pending', 'paid', 'expired', 'refunded'], default: 'pending' })
  paymentStatus: string;

  @Prop()
  stripeSessionId?: string;

  @Prop()
  amountCzk?: number;

  @Prop()
  cancelToken?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
