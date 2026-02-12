import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ type: [String], default: ['CZ'] })
  languages: string[];

  @Prop({
    type: Object,
    default: {},
  })
  schedule: {
    mon?: { from: string; to: string };
    tue?: { from: string; to: string };
    wed?: { from: string; to: string };
    thu?: { from: string; to: string };
    fri?: { from: string; to: string };
  };

  @Prop({ default: 30 })
  slotDurationMinutes: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
