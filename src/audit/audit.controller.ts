import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuditEvent } from './audit.schema.js';
import { Model } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard.js';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('admin/audit')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(
    @InjectModel(AuditEvent.name) private auditModel: Model<AuditEvent>,
  ) {}

  @Get()
  async getAuditEvents(
    @Query('limit') limit?: number,
    @Query('entity') entity?: string,
  ) {
    const query: any = {};
    if (entity) query.entity = entity;
    return this.auditModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit || 100)
      .exec();
  }
}
