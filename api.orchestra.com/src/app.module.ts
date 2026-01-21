import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CoreModule } from './modules/core/core.module';
import { OperationsModule } from './modules/operations/operations.module';
import { FinanceModule } from './modules/finance/finance.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { HrisModule } from './modules/hris/hris.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (dev only)
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Feature modules
    CoreModule,
    OperationsModule,
    FinanceModule,
    RbacModule,
    HrisModule,
  ],
})
export class AppModule {}
