import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/config.js';
import { CalcomModule } from './calcom/calcom.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CalcomModule,
  ],
})
export class AppModule {}
