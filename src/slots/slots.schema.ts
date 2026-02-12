import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Slot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ enum: ['available', 'booked', 'blocked'], default: 'available' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);

SlotSchema.index({ doctorId: 1, date: 1, status: 1 });
SlotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });
