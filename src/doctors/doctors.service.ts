import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from './doctors.schema.js';
import { Model } from 'mongoose';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/create-doctor.dto.js';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async findAllActive() {
    return this.doctorModel.find({ isActive: true });
  }

  async findAll() {
    return this.doctorModel.find();
  }

  async findById(id: string) {
    const doctor = await this.doctorModel.findById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async create(dto: CreateDoctorDto) {
    return this.doctorModel.create(dto);
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const doctor = await this.doctorModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }
}
