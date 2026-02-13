import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import {
  CreateAppointmentDto,
  CancelAppointmentDto,
} from './dto/create-appointment.dto.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('appointments')
  @ApiOperation({ summary: 'Create appointment and get Stripe checkout URL (public)' })
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.appointmentsService.create(dto, baseUrl);
  }

  @Post('appointments/cancel')
  @ApiOperation({ summary: 'Cancel appointment by token (public)' })
  cancelByToken(@Body() dto: CancelAppointmentDto) {
    return this.appointmentsService.cancelByToken(dto);
  }

  @Get('admin/appointments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List appointments (admin)' })
  findAll(
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
  ) {
    return this.appointmentsService.findAll({ doctorId, status, date, search });
  }

  @Get('admin/appointments/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Appointment stats (admin)' })
  stats() {
    return this.appointmentsService.getStats();
  }

  @Put('admin/appointments/:id/cancel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel appointment (admin)' })
  cancelById(@Param('id') id: string) {
    return this.appointmentsService.cancelById(id);
  }
}
