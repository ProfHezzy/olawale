import { Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { AiBlogService } from './ai-blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-blog')
export class AiBlogController {
  constructor(private readonly aiBlogService: AiBlogService) {}

  /**
   * Manually trigger AI blog post generation.
   * POST /ai-blog/generate?type=expertise|news|jobs
   * If no type is specified, it auto-rotates.
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
   * Health check — confirms the AI blog service schedule.
   * GET /ai-blog/status
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
      message: 'AI Blog Autopilot is running. 2 posts generated daily.',
    };
  }
}
