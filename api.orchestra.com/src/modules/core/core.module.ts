import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [SessionModule, AuthModule, CompanyModule, MenuModule],
})
export class CoreModule {}
