import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { Academic } from './entities/academic.entity';

@Controller('academics')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get()
  findAll() {
    return this.academicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Academic>) {
    return this.academicService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Academic>) {
    return this.academicService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicService.remove(+id);
  }
}
