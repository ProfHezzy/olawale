import { Controller, Post, Get, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBlogService } from './ai-blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-blog')
export class AiBlogController {
  constructor(
    private readonly aiBlogService: AiBlogService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Manually trigger AI blog post generation from Admin panel.
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateNow(@Query('type') type?: 'expertise' | 'news' | 'jobs') {
    const result = await this.aiBlogService.generateAndPublishPost(type);
    if (result.success) {
      return { message: `✅ Blog post published: "${result.title}"`, success: true };
    }
    return { message: `❌ Failed: ${result.error}`, success: false };
  }

  /**
   * External Trigger for cron-job.org or other services to bypass Render's sleep issue.
   * Usage: GET or POST /ai-blog/cron-trigger?secret=super-secret-cron-key-123&time=morning
   */
  @Get('cron-trigger')
  @Post('cron-trigger')
  async cronTrigger(
    @Query('secret') secret: string,
    @Query('time') time?: 'morning' | 'afternoon'
  ) {
    const expectedSecret = this.configService.get<string>('CRON_SECRET');
    if (!expectedSecret || secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid cron secret');
    }

    // Trigger specific job based on time parameter, or let it auto-rotate
    let result;
    if (time === 'morning') {
      result = await this.aiBlogService.generateMorningPost();
    } else if (time === 'afternoon') {
      result = await this.aiBlogService.generateAfternoonPost();
    } else {
      result = await this.aiBlogService.generateAndPublishPost();
    }

    if (result.success) {
      return { message: `✅ Cron post published: "${result.title}"`, success: true };
    }
    return { message: `❌ Cron failed: ${result.error}`, success: false };
  }

  /**
   * Health check — confirms the AI blog service schedule.
   */
  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus() {
    return {
      status: 'active',
      schedule: [
        { time: '08:00 AM WAT', type: 'Expertise Articles / Tech News (alternating)' },
        { time: '02:00 PM WAT', type: 'Job Listings with Application Links' },
      ],
      postTypes: ['expertise', 'news', 'jobs'],
      message: 'AI Blog Autopilot is running. External cron endpoint is enabled.',
    };
  }
}
