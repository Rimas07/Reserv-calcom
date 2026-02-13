import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from '../appointments/appointments.schema.js';
import { Model } from 'mongoose';
import { SlotsService } from '../slots/slots.service.js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
    private slotsService: SlotsService,
  ) {}

  @Cron('*/1 * * * *')
  async releaseExpiredHolds() {
    const releasedSlotIds = await this.slotsService.releaseExpiredHolds();

    if (releasedSlotIds.length > 0) {
      await this.appointmentModel.updateMany(
        { slotId: { $in: releasedSlotIds }, status: 'pending' },
        { $set: { status: 'expired', paymentStatus: 'expired' } },
      );
      this.logger.log(`Released ${releasedSlotIds.length} expired held slots`);
    }
  }
}
