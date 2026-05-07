import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { Academic } from './entities/academic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Academic])],
  controllers: [AcademicController],
  providers: [AcademicService],
})
export class AcademicsModule {}
