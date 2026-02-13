import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Slot ID to book' })
  @IsNotEmpty()
  @IsMongoId()
  slotId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsNotEmpty()
  @IsMongoId()
  doctorId: string;

  @ApiProperty({ example: 'Jan Novak' })
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @ApiProperty({ example: '+420777123456' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'jan@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'VZP (111)' })
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiPropertyOptional({ example: 'Problem description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Primary consultation' })
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @ApiPropertyOptional({ example: 'MUDr. Jan Dvorak' })
  @IsOptional()
  @IsString()
  doctorName?: string;
}

export class CancelAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cancelToken: string;
}
