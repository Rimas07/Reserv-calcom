import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './appointments.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
  ) {}

  async createFromCalcom(data: {
    calcomBookingId: string;
    calcomBookingUid: string;
    patientName: string;
    email?: string;
    phone?: string;
    insurance?: string;
    birthDate?: string;
    description?: string;
    serviceName: string;
    doctorName?: string;
    startTime?: string;
    endTime?: string;
    status: string;
  }) {
    return this.appointmentModel.create(data);
  }

  async cancelByCalcomUid(uid: string) {
    const appointment = await this.appointmentModel.findOne({
      calcomBookingUid: uid,
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    appointment.status = 'cancelled';
    await appointment.save();
    return appointment;
  }

  async rescheduleByCalcomUid(
    oldUid: string,
    update: { startTime: string; endTime: string; calcomBookingUid: string },
  ) {
    const appointment = await this.appointmentModel.findOne({
      calcomBookingUid: oldUid,
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    appointment.startTime = update.startTime;
    appointment.endTime = update.endTime;
    appointment.calcomBookingUid = update.calcomBookingUid;
    appointment.status = 'confirmed';
    await appointment.save();
    return appointment;
  }

  async cancelById(id: string) {
    const appointment = await this.appointmentModel.findById(id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.status === 'cancelled') return { message: 'Already cancelled' };
    appointment.status = 'cancelled';
    await appointment.save();
    return { message: 'Appointment cancelled' };
  }

  async findAll(filters: {
    status?: string;
    search?: string;
  }) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { patientName: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.appointmentModel.find(query).sort({ createdAt: -1 });
  }

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const totalThisMonth = await this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const today = now.toISOString().split('T')[0];
    const todayStart = new Date(today).toISOString();
    const newToday = await this.appointmentModel.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const cancelled = await this.appointmentModel.countDocuments({
      status: 'cancelled',
      createdAt: { $gte: startOfMonth },
    });

    const recent = await this.appointmentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    return { totalThisMonth, newToday, cancelled, recent };
  }
}
