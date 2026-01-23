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
        synchronize: false, // Use migrations instead
        ssl: {
          rejectUnauthorized: false, // Required for Neon
        },
        logging: true, // Enable logging to see what's happening
      }),
      inject: [ConfigService],
    }),
    // Feature modules
    SystemModule,
    OperationsModule,
    FinanceModule,
    HrisModule,
    ManagementModule,
  ],
})
export class AppModule {}
