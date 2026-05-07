import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { Certification } from './entities/certification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certification])],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
