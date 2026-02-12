import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/create-doctor.dto.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Doctors')
@Controller()
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('doctors')
  @ApiOperation({ summary: 'List active doctors (public)' })
  findAllActive() {
    return this.doctorsService.findAllActive();
  }

  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get doctor by ID (public)' })
  findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Post('admin/doctors')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create doctor (admin)' })
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }

  @Put('admin/doctors/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.update(id, dto);
  }
}
