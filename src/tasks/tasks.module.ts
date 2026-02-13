import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/appointments.schema.js';
import { TasksService } from './tasks.service.js';
import { SlotsModule } from '../slots/slots.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    SlotsModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
