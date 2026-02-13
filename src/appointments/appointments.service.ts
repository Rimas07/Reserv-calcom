import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './appointments.schema.js';
import { Model, Types } from 'mongoose';
import { SlotsService } from '../slots/slots.service.js';
import { StripeService } from '../stripe/stripe.service.js';
import { CreateAppointmentDto, CancelAppointmentDto } from './dto/create-appointment.dto.js';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<Appointment>,
    private slotsService: SlotsService,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateAppointmentDto, baseUrl: string) {
    const cancelToken = nanoid(16);
    const priceCzk = this.configService.get<number>('stripe.priceCzk') || 500;

    const appointment = await this.appointmentModel.create({
      ...dto,
      cancelToken,
      status: 'pending',
      paymentStatus: 'pending',
      amountCzk: priceCzk,
    });

    try {
      await this.slotsService.holdSlot(
        dto.slotId,
        appointment._id!.toString(),
      );
    } catch (error) {
      await this.appointmentModel.findByIdAndDelete(appointment._id);
      throw new ConflictException('Slot is already booked');
    }

    const slot = await this.slotsService.getSlotById(dto.slotId);
    const session = await this.stripeService.createCheckoutSession({
      appointmentId: appointment._id!.toString(),
      doctorName: dto.doctorName || dto.serviceName,
      serviceName: dto.serviceName,
      date: slot?.date || '',
      startTime: slot?.startTime || '',
      baseUrl,
    });

    appointment.stripeSessionId = session.id;
    await appointment.save();

    return {
      checkoutUrl: session.url,
      appointmentId: appointment._id!.toString(),
    };
  }

  async confirmPayment(appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = 'confirmed';
    appointment.paymentStatus = 'paid';
    await appointment.save();

    await this.slotsService.confirmSlot(appointment.slotId.toString());

    return appointment;
  }

  async cancelByToken(dto: CancelAppointmentDto) {
    const appointment = await this.appointmentModel.findOne({
      cancelToken: dto.cancelToken,
      status: 'confirmed',
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = 'cancelled';
    await appointment.save();
    await this.slotsService.releaseSlot(appointment.slotId.toString());

    return { message: 'Appointment cancelled' };
  }

  async cancelById(id: string) {
    const appointment = await this.appointmentModel.findById(id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.status === 'cancelled') return { message: 'Already cancelled' };

    appointment.status = 'cancelled';
    await appointment.save();
    await this.slotsService.releaseSlot(appointment.slotId.toString());

    return { message: 'Appointment cancelled' };
  }

  async findAll(filters: {
    doctorId?: string;
    status?: string;
    date?: string;
    search?: string;
  }) {
    const query: any = {};
    if (filters.doctorId) query.doctorId = new Types.ObjectId(filters.doctorId);
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { patientName: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
      ];
    }

    let result = this.appointmentModel
      .find(query)
      .populate('slotId')
      .populate('doctorId')
      .sort({ createdAt: -1 });

    const appointments = await result;

    if (filters.date) {
      return appointments.filter((a: any) => a.slotId?.date === filters.date);
    }

    return appointments;
  }

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString();

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
      .populate('doctorId')
      .populate('slotId')
      .sort({ createdAt: -1 })
      .limit(10);

    return { totalThisMonth, newToday, cancelled, recent };
  }
}
