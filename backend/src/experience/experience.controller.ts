import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './entities/experience.entity';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Experience>) {
    return this.experienceService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Experience>) {
    return this.experienceService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(+id);
  }
}
