import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import configuration from './config/config.js';
import { AuthModule } from './auth/auth.module.js';
import { AuditModule } from './audit/audit.module.js';
import { UsersModule } from './users/users.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';
import { SlotsModule } from './slots/slots.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { StripeModule } from './stripe/stripe.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({ global: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AuditModule,
    DoctorsModule,
    SlotsModule,
    AppointmentsModule,
    StripeModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
})
export class AppModule {}
