import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../blog/entities/blog.entity';
import { Project } from '../projects/entities/project.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(BlogPost)
    private blogRepository: Repository<BlogPost>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getStats() {
    const [
      blogCount,
      projectCount,
      messageCount,
      unreadMessages,
      blogLikes,
      blogShares,
      projectLikes,
      projectShares,
      totalComments,
      pendingComments
    ] = await Promise.all([
      this.blogRepository.count(),
      this.projectRepository.count(),
      this.messageRepository.count(),
      this.messageRepository.count({ where: { read: false } }),
      this.blogRepository.sum('likes'),
      this.blogRepository.sum('shares'),
      this.projectRepository.sum('likes'),
      this.projectRepository.sum('shares'),
      this.commentRepository.count(),
      this.commentRepository.count({ where: { approved: false } }),
    ]);

    return {
      blogs: {
        total: blogCount,
        likes: blogLikes || 0,
        shares: blogShares || 0,
      },
      projects: {
        total: projectCount,
        likes: projectLikes || 0,
        shares: projectShares || 0,
      },
      messages: {
        total: messageCount,
        unread: unreadMessages,
      },
      engagement: {
        totalLikes: (blogLikes || 0) + (projectLikes || 0),
        totalShares: (blogShares || 0) + (projectShares || 0),
        totalComments,
        pendingComments,
      }
    };
  }
}
