import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPost } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: Partial<BlogPost>) {
    return this.blogService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<BlogPost>) {
    return this.blogService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Patch(':id/like')
  like(@Param('id') id: string) {
    return this.blogService.like(id);
  }

  @Patch(':id/share')
  share(@Param('id') id: string) {
    return this.blogService.share(id);
  }
}
