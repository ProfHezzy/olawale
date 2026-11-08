import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  Ip,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackPage(
    @Body() body: { path: string; referrer?: string; clientCountry?: string },
    @Ip() ipAddress: string,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Headers('cf-ipcountry') countryHeader?: string,
    @Headers('x-forwarded-for') xForwardedFor?: string,
  ) {
    // Standardize client IP check (tolerate headers if behind proxies/Cloudflare)
    const clientIp = xForwardedFor
      ? xForwardedFor.split(',')[0].trim()
      : ipAddress || req.ip || '127.0.0.1';

    return this.analyticsService.recordVisit({
      ip: clientIp,
      path: body.path,
      referrer: body.referrer,
      userAgent: userAgent || 'Unknown',
      countryHeader: countryHeader,
      clientCountry: body.clientCountry,
    });
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboard() {
    return this.analyticsService.getDashboardStats();
  }
}
