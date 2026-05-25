import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlogModule } from '../blog/blog.module';
import { AiBlogService } from './ai-blog.service';
import { AiBlogScheduler } from './ai-blog.scheduler';
import { AiBlogController } from './ai-blog.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BlogModule,
  ],
  providers: [AiBlogService, AiBlogScheduler],
  controllers: [AiBlogController],
})
export class AiBlogModule {}
