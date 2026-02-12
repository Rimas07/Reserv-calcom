import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditEvent extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop()
  entityId?: string;

  @Prop()
  userId?: string;

  @Prop({ type: Object })
  details?: Record<string, any>;

  @Prop({ default: () => new Date() })
  timestamp: Date;
}

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);
