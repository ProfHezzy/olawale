import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: Partial<Project>) {
    return this.projectsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Project>) {
    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/like')
  like(@Param('id') id: string) {
    return this.projectsService.like(id);
  }

  @Patch(':id/share')
  share(@Param('id') id: string) {
    return this.projectsService.share(id);
  }
}
