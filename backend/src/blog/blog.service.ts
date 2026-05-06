import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogRepository: Repository<BlogPost>,
  ) {}

  async findAll() {
    return this.blogRepository.find({
      where: { published: true },
      order: { created_at: 'DESC' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.blogRepository.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: Partial<BlogPost>) {
    const post = this.blogRepository.create(data);
    return this.blogRepository.save(post);
  }

  async update(id: string, data: Partial<BlogPost>) {
    await this.blogRepository.update(id, data);
    return this.blogRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.blogRepository.delete(id);
  }
}
