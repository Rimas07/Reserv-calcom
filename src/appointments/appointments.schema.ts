import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ required: true })
  calcomBookingId: string;

  @Prop({ required: true, unique: true })
  calcomBookingUid: string;

  @Prop({ required: true })
  patientName: string;

  @Prop()
  phone?: string;

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

  @Prop()
  doctorName?: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({ enum: ['confirmed', 'cancelled', 'rescheduled'], default: 'confirmed' })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
