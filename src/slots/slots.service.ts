import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slot } from './slots.schema.js';
import { Model, Types } from 'mongoose';
import { DoctorsService } from '../doctors/doctors.service.js';

@Injectable()
export class SlotsService {
  constructor(
    @InjectModel(Slot.name) private slotModel: Model<Slot>,
    private doctorsService: DoctorsService,
  ) {}

  async getAvailableSlots(doctorId: string, date: string) {
    return this.slotModel
      .find({ doctorId: new Types.ObjectId(doctorId), date, status: 'available' })
      .sort({ startTime: 1 });
  }

  async getAllSlots(doctorId: string, date: string) {
    return this.slotModel.find({ doctorId: new Types.ObjectId(doctorId), date }).sort({ startTime: 1 });
  }

  async bookSlot(slotId: string, appointmentId: string) {
    const result = await this.slotModel.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { $set: { status: 'booked', appointmentId } },
      { new: true },
    );
    if (!result) throw new ConflictException('Slot is already booked');
    return result;
  }

  async releaseSlot(slotId: string) {
    const result = await this.slotModel.findByIdAndUpdate(
      slotId,
      { $set: { status: 'available' }, $unset: { appointmentId: '' } },
      { new: true },
    );
    if (!result) throw new NotFoundException('Slot not found');
    return result;
  }

  async blockSlot(slotId: string) {
    const result = await this.slotModel.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { $set: { status: 'blocked' } },
      { new: true },
    );
    if (!result) throw new ConflictException('Slot cannot be blocked');
    return result;
  }

  async generateSlots(doctorId: string, year: number, month: number) {
    const doctor = await this.doctorsService.findById(doctorId);
    const schedule = doctor.schedule;
    if (!schedule) return { generated: 0 };

    const dayMap: Record<string, number> = {
      mon: 1, tue: 2, wed: 3, thu: 4, fri: 5,
    };

    const daysInMonth = new Date(year, month, 0).getDate();
    const slots: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();

      for (const [dayName, dayNum] of Object.entries(dayMap)) {
        if (dayOfWeek !== dayNum) continue;
        const daySchedule = (schedule as any)[dayName];
        if (!daySchedule) continue;

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const [fromH, fromM] = daySchedule.from.split(':').map(Number);
        const [toH, toM] = daySchedule.to.split(':').map(Number);
        const startMin = fromH * 60 + fromM;
        const endMin = toH * 60 + toM;

        for (let m = startMin; m + doctor.slotDurationMinutes <= endMin; m += doctor.slotDurationMinutes) {
          const startTime = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
          const endM = m + doctor.slotDurationMinutes;
          const endTime = `${String(Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;

          slots.push({
            doctorId: doctor._id,
            date: dateStr,
            startTime,
            endTime,
            status: 'available',
          });
        }
      }
    }

    let generated = 0;
    for (const slot of slots) {
      try {
        await this.slotModel.updateOne(
          { doctorId: slot.doctorId, date: slot.date, startTime: slot.startTime },
          { $setOnInsert: slot },
          { upsert: true },
        );
        generated++;
      } catch {
        // skip duplicates
      }
    }

    return { generated, total: slots.length };
  }

  async countAvailableByDoctor(doctorId: string) {
    return this.slotModel.countDocuments({
      doctorId: new Types.ObjectId(doctorId),
      status: 'available',
      date: { $gte: new Date().toISOString().split('T')[0] },
    });
  }
}
