import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AiBlogService } from './ai-blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-blog')
export class AiBlogController {
  constructor(private readonly aiBlogService: AiBlogService) {}

  /**
   * Manually trigger AI blog post generation.
   * Protected — only admin can call this.
   * POST /ai-blog/generate
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateNow() {
    const result = await this.aiBlogService.generateAndPublishPost();
    if (result.success) {
      return { message: `✅ Blog post published: "${result.title}"`, success: true };
    }
    return { message: `❌ Failed: ${result.error}`, success: false };
  }

  /**
   * Health check — confirms the AI blog service is active.
   * GET /ai-blog/status
   */
  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus() {
    return {
      status: 'active',
      schedule: 'Daily at 08:00 AM WAT (07:00 UTC)',
      message: 'AI Blog Autopilot is running. Posts are generated automatically every day.',
    };
  }
}
