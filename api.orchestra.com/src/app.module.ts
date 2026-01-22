import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperationsModule } from './modules/operations/operations.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SystemModule } from './modules/system/system.module';
import { HrisModule } from './modules/hris/hris.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagementModule } from './modules/management/management.module';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (dev only)
        ssl: false,
      }),
      inject: [ConfigService],
    }),
    // Feature modules
    OperationsModule,
    FinanceModule,
    SystemModule,
    HrisModule,
    ManagementModule,
  ],
})
export class AppModule {}
