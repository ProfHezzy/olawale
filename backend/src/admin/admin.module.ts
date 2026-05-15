import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BlogPost } from '../blog/entities/blog.entity';
import { Project } from '../projects/entities/project.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost, Project, Comment, Message]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
