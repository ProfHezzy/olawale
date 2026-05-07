import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { Certification } from './entities/certification.entity';

@Controller('certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Get()
  findAll() {
    return this.certificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificationService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Certification>) {
    return this.certificationService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Certification>) {
    return this.certificationService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificationService.remove(+id);
  }
}
