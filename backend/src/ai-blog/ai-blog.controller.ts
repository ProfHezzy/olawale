import { Controller, Post, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBlogService } from './ai-blog.service';

type AiBlogResult = { success: boolean; title?: string; error?: string };

@Controller('ai-blog')
export class AiBlogController {
  constructor(
    private readonly aiBlogService: AiBlogService,
    private readonly configService: ConfigService,
  ) {}

  @Post('generate')
  async generateNow(@Query('type') type?: 'expertise' | 'news' | 'jobs') {
    const result = await this.aiBlogService.generateAndPublishPost(type);
    if (result.success) {
      return {
        message: `✅ Blog post published: "${result.title}"`,
        success: true,
      };
    }
    return { message: `❌ Failed: ${result.error}`, success: false };
  }

  @Get('cron-trigger')
  @Post('cron-trigger')
  cronTrigger(
    @Query('secret') secret: string,
    @Query('time') time?: 'morning' | 'afternoon',
  ): { message: string; success: boolean } {
    const expectedSecret = this.configService.get<string>('CRON_SECRET');
    if (!expectedSecret || secret !== expectedSecret) {
      return { message: 'Invalid cron secret', success: false };
    }

    void this.triggerBackgroundPost(time);

    return {
      message:
        '✅ Background AI generation started successfully. You can close this connection.',
      success: true,
    };
  }

  private async triggerBackgroundPost(
    time?: 'morning' | 'afternoon',
  ): Promise<void> {
    try {
      let result: AiBlogResult;
      if (time === 'morning') {
        result = await this.aiBlogService.generateMorningPost();
      } else if (time === 'afternoon') {
        result = await this.aiBlogService.generateAfternoonPost();
      } else {
        result = await this.aiBlogService.generateAndPublishPost();
      }

      if (result.success) {
        console.log(`✅ Background Cron post published: "${result.title}"`);
      } else {
        console.error(`❌ Background Cron failed: ${result.error}`);
      }
    } catch (err: unknown) {
      console.error(`💥 Background Cron Exception:`, err);
    }
  }

  @Get('status')
  getStatus() {
    return {
      status: 'active',
      schedule: [
        {
          time: '08:00 AM WAT',
          type: 'Expertise Articles / Tech News (alternating)',
        },
        { time: '02:00 PM WAT', type: 'Job Listings with Application Links' },
      ],
      postTypes: ['expertise', 'news', 'jobs'],
      message:
        'AI Blog Autopilot is running. External cron endpoint is enabled.',
    };
  }
}
