import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(data: Partial<Comment>) {
    const comment = this.commentsRepository.create(data);
    return this.commentsRepository.save(comment);
  }

  async findByTarget(targetType: 'blog' | 'project', targetId: string) {
    return this.commentsRepository.find({
      where: { target_type: targetType, target_id: targetId, approved: true },
      order: { created_at: 'DESC' },
    });
  }

  async findAll() {
    return this.commentsRepository.find({ order: { created_at: 'DESC' } });
  }

  async approve(id: string) {
    return this.commentsRepository.update(id, { approved: true });
  }

  async remove(id: string) {
    return this.commentsRepository.delete(id);
  }
}
