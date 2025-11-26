import { Module } from '@nestjs/common';
import { MaestrosService } from './maestros.service';
import { MaestrosController } from './maestros.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [MaestrosController],
  providers: [MaestrosService],
})
export class MaestrosModule {}
