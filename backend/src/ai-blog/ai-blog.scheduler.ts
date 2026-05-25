import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AiBlogService } from './ai-blog.service';

@Injectable()
export class AiBlogScheduler {
  private readonly logger = new Logger(AiBlogScheduler.name);

  constructor(private readonly aiBlogService: AiBlogService) {}

  // ──────────────────────────────────────
  // POST 1: Runs at 8:00 AM WAT (7:00 AM UTC)
  // Alternates between expertise articles and tech news
  // ──────────────────────────────────────
  @Cron('0 7 * * *', { timeZone: 'UTC' })
  async handleMorningPost() {
    this.logger.log('🌅 [8AM WAT] Morning AI Blog: Starting...');
    const result = await this.aiBlogService.generateMorningPost();
    if (result.success) {
      this.logger.log(`🎉 Morning Post: "${result.title}"`);
    } else {
      this.logger.error(`💥 Morning Post Failed: ${result.error}`);
    }
  }

  // ──────────────────────────────────────
  // POST 2: Runs at 2:00 PM WAT (1:00 PM UTC)
  // Always generates job listings with tables
  // ──────────────────────────────────────
  @Cron('0 13 * * *', { timeZone: 'UTC' })
  async handleAfternoonPost() {
    this.logger.log('🌤️  [2PM WAT] Afternoon AI Blog: Starting job listings...');
    const result = await this.aiBlogService.generateAfternoonPost();
    if (result.success) {
      this.logger.log(`🎉 Afternoon Post: "${result.title}"`);
    } else {
      this.logger.error(`💥 Afternoon Post Failed: ${result.error}`);
    }
  }
}
