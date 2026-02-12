import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: 'MUDr. Olga Petrova' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Urolog' })
  @IsNotEmpty()
  @IsString()
  specialization: string;

  @ApiPropertyOptional({ example: ['CZ', 'RU', 'UA'] })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiPropertyOptional({
    example: {
      mon: { from: '08:00', to: '16:00' },
      tue: { from: '08:00', to: '16:00' },
      wed: { from: '08:00', to: '12:00' },
      thu: { from: '08:00', to: '16:00' },
      fri: { from: '08:00', to: '14:00' },
    },
  })
  @IsOptional()
  schedule?: Record<string, { from: string; to: string }>;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  slotDurationMinutes?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDoctorDto extends CreateDoctorDto {}
