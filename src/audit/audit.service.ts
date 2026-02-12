import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuditEvent } from './audit.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditEvent.name) private auditModel: Model<AuditEvent>,
  ) {}

  async log(data: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    details?: Record<string, any>;
  }) {
    try {
      await this.auditModel.create({
        ...data,
        timestamp: new Date(),
      });
    } catch (error: any) {
      this.logger.error(`Failed to save audit event: ${error.message}`);
    }
  }
}
