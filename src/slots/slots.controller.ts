import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Slots')
@Controller()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('slots')
  @ApiOperation({ summary: 'Get available slots (public)' })
  getAvailable(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.slotsService.getAvailableSlots(doctorId, date);
  }

  @Get('admin/slots')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all slots (admin)' })
  getAll(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.slotsService.getAllSlots(doctorId, date);
  }

  @Post('admin/slots/generate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate slots for a month (admin)' })
  generate(
    @Body() body: { doctorId: string; year: number; month: number },
  ) {
    return this.slotsService.generateSlots(body.doctorId, body.year, body.month);
  }

  @Put('admin/slots/:id/block')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a slot (admin)' })
  block(@Param('id') id: string) {
    return this.slotsService.blockSlot(id);
  }

  @Put('admin/slots/:id/release')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Release a slot (admin)' })
  release(@Param('id') id: string) {
    return this.slotsService.releaseSlot(id);
  }
}
