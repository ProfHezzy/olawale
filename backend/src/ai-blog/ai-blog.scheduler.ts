import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AiBlogService } from './ai-blog.service';

@Injectable()
export class AiBlogScheduler {
  private readonly logger = new Logger(AiBlogScheduler.name);

  constructor(private readonly aiBlogService: AiBlogService) {}

  // Runs every day at 8:00 AM WAT (7:00 AM UTC — Nigeria is UTC+1)
  @Cron('0 7 * * *', { timeZone: 'UTC' })
  async handleDailyBlogPost() {
    this.logger.log('📅 Daily AI Blog: Starting scheduled post generation...');
    const result = await this.aiBlogService.generateAndPublishPost();
    if (result.success) {
      this.logger.log(`🎉 Daily AI Blog: Successfully published "${result.title}"`);
    } else {
      this.logger.error(`💥 Daily AI Blog: Failed — ${result.error}`);
    }
  }
}
