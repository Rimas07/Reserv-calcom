import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from './slots.schema.js';
import { SlotsController } from './slots.controller.js';
import { SlotsService } from './slots.service.js';
import { DoctorsModule } from '../doctors/doctors.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
    DoctorsModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
