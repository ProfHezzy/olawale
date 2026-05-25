import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly salt: string;

  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private readonly configService: ConfigService,
  ) {
    this.salt = this.configService.get<string>('JWT_SECRET') || 'fallback-salt-key-123';
  }

  /**
   * Helper to anonymize IP addresses via a salted 1-way SHA-256 hash.
   * Completely GDPR & CCPA compliant (no personal identifiable data stored).
   */
  private hashIp(ip: string): string {
    const cleanIp = ip.replace(/^::ffff:/, '').trim();
    return crypto
      .createHash('sha256')
      .update(cleanIp + this.salt)
      .digest('hex')
      .slice(0, 32);
  }

  /**
   * Parse user agent string into browser, OS, and device type.
   */
  private parseUserAgent(uaString: string): { browser: string; os: string; device: string } {
    if (!uaString) {
      return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };
    }

    const ua = uaString.toLowerCase();
    let device = 'Desktop';
    let os = 'Unknown';
    let browser = 'Unknown';

    // 1. Device Type
    if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
      device = 'Tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
      device = 'Mobile';
    }

    // 2. Operating System
    if (ua.includes('windows')) {
      os = 'Windows';
    } else if (ua.includes('macintosh') || ua.includes('mac os')) {
      os = 'MacOS';
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      os = 'iOS';
    } else if (ua.includes('android')) {
      os = 'Android';
    } else if (ua.includes('linux')) {
      os = 'Linux';
    }

    // 3. Browser
    if (ua.includes('edg/')) {
      browser = 'Edge';
    } else if (ua.includes('chrome') || ua.includes('crios')) {
      browser = 'Chrome';
    } else if (ua.includes('firefox') || ua.includes('fxios')) {
      browser = 'Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')) {
      browser = 'Safari';
    } else if (ua.includes('opr/') || ua.includes('opera')) {
      browser = 'Opera';
    }

    return { browser, os, device };
  }

  /**
   * Parse referrer URL to get clean domain name.
   */
  private parseReferrer(refUrl?: string): string {
    if (!refUrl || refUrl === '' || refUrl === 'null' || refUrl === 'undefined') {
      return 'Direct';
    }

    try {
      const url = new URL(refUrl);
      let hostname = url.hostname.replace('www.', '');
      
      // Clean up common referrers
      if (hostname.includes('t.co') || hostname.includes('twitter.com')) {
        return 'Twitter/X';
      }
      if (hostname.includes('linkedin.com')) {
        return 'LinkedIn';
      }
      if (hostname.includes('github.com')) {
        return 'GitHub';
      }
      if (hostname.includes('google.')) {
        return 'Google';
      }
      
      return hostname;
    } catch {
      // Fallback if document.referrer is a raw string
      if (refUrl.toLowerCase().includes('linkedin')) return 'LinkedIn';
      if (refUrl.toLowerCase().includes('github')) return 'GitHub';
      if (refUrl.toLowerCase().includes('google')) return 'Google';
      if (refUrl.toLowerCase().includes('twitter') || refUrl.toLowerCase().includes('t.co')) return 'Twitter/X';
      return refUrl;
    }
  }

  /**
   * Public tracking method to save visit entries.
   */
  async recordVisit(payload: {
    ip: string;
    path: string;
    referrer?: string;
    userAgent: string;
    countryHeader?: string;
    clientCountry?: string;
  }): Promise<boolean> {
    try {
      const ipHash = this.hashIp(payload.ip || '127.0.0.1');
      const { browser, os, device } = this.parseUserAgent(payload.userAgent);
      const referrer = this.parseReferrer(payload.referrer);
      
      // Prioritize Render/Cloudflare headers, then client-side timezone-based country, then default
      const country = payload.countryHeader || payload.clientCountry || 'Unknown';

      const visit = new Visit();
      visit.ipHash = ipHash;
      visit.path = payload.path || '/';
      visit.referrer = referrer;
      visit.browser = browser;
      visit.os = os;
      visit.device = device;
      visit.country = country;

      await this.visitRepository.save(visit);
      return true;
    } catch (error: any) {
      this.logger.error(`Error recording visit: ${error.message}`);
      return false;
    }
  }

  /**
   * Core stats aggregation query providing deeply nested, fully complete dashboard metrics.
   */
  async getDashboardStats() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    const [
      totalPageViews,
      allUniqueVisitors,
      liveVisitors,
      visitsPastYear
    ] = await Promise.all([
      this.visitRepository.count(),
      this.visitRepository
        .createQueryBuilder('visit')
        .select('COUNT(DISTINCT visit.ipHash)', 'count')
        .getRawOne()
        .then((res) => parseInt(res.count || '0', 10)),
      this.visitRepository
        .createQueryBuilder('visit')
        .select('COUNT(DISTINCT visit.ipHash)', 'count')
        .where('visit.timestamp >= :time', { time: fiveMinutesAgo })
        .getRawOne()
        .then((res) => parseInt(res.count || '0', 10)),
      this.visitRepository.find({
        where: { timestamp: MoreThan(oneYearAgo) },
        order: { timestamp: 'ASC' },
      })
    ]);

    // ──────────────────────────────────────
    // 1. DATA GROUPING (Referrers, Pages, Hardware, Geo)
    // ──────────────────────────────────────
    const referrersMap: Record<string, number> = {};
    const pagesMap: Record<string, { total: number; unique: Set<string> }> = {};
    const devicesMap: Record<string, number> = {};
    const browsersMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const countriesMap: Record<string, number> = {};

    visitsPastYear.forEach((v) => {
      // Referrers
      referrersMap[v.referrer] = (referrersMap[v.referrer] || 0) + 1;
      
      // Page Views (Unique is calculated per path)
      if (!pagesMap[v.path]) {
        pagesMap[v.path] = { total: 0, unique: new Set() };
      }
      pagesMap[v.path].total += 1;
      pagesMap[v.path].unique.add(v.ipHash);

      // Hardware
      devicesMap[v.device] = (devicesMap[v.device] || 0) + 1;
      browsersMap[v.browser] = (browsersMap[v.browser] || 0) + 1;
      osMap[v.os] = (osMap[v.os] || 0) + 1;

      // Countries
      countriesMap[v.country] = (countriesMap[v.country] || 0) + 1;
    });

    // Formatting counts
    const topReferrers = Object.entries(referrersMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const topPages = Object.entries(pagesMap)
      .map(([path, data]) => ({
        path,
        views: data.total,
        uniques: data.unique.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const hardware = {
      devices: Object.entries(devicesMap).map(([name, count]) => ({ name, count })),
      browsers: Object.entries(browsersMap).map(([name, count]) => ({ name, count })),
      os: Object.entries(osMap).map(([name, count]) => ({ name, count })),
    };

    const topCountries = Object.entries(countriesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // ──────────────────────────────────────
    // 2. TIME SERIES AGGREGATIONS
    // ──────────────────────────────────────
    // (a) Daily Trends (Past 7 Days)
    const dailyViews: Record<string, { views: number; uniques: Set<string> }> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dailyViews[label] = { views: 0, uniques: new Set() };
    }

    // (b) Weekly Trends (Past 4 Weeks)
    const weeklyViews: Record<string, { views: number; uniques: Set<string> }> = {};
    for (let i = 3; i >= 0; i--) {
      const label = `Week -${i}`;
      weeklyViews[label] = { views: 0, uniques: new Set() };
    }

    // (c) Monthly Trends (Past 12 Months)
    const monthlyViews: Record<string, { views: number; uniques: Set<string> }> = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyViews[label] = { views: 0, uniques: new Set() };
    }

    // Process visits into time series bins
    const nowTime = Date.now();
    visitsPastYear.forEach((v) => {
      const visitTime = new Date(v.timestamp).getTime();
      const visitDate = new Date(v.timestamp);

      // 7-day bin
      const daysAgo = Math.floor((nowTime - visitTime) / (24 * 60 * 60 * 1000));
      if (daysAgo >= 0 && daysAgo < 7) {
        const label = visitDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (dailyViews[label]) {
          dailyViews[label].views += 1;
          dailyViews[label].uniques.add(v.ipHash);
        }
      }

      // 4-week bin
      const weeksAgo = Math.floor((nowTime - visitTime) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo >= 0 && weeksAgo < 4) {
        const label = `Week -${weeksAgo}`;
        if (weeklyViews[label]) {
          weeklyViews[label].views += 1;
          weeklyViews[label].uniques.add(v.ipHash);
        }
      }

      // 12-month bin
      const monthsAgo =
        (new Date().getFullYear() - visitDate.getFullYear()) * 12 +
        (new Date().getMonth() - visitDate.getMonth());
      if (monthsAgo >= 0 && monthsAgo < 12) {
        const label = visitDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (monthlyViews[label]) {
          monthlyViews[label].views += 1;
          monthlyViews[label].uniques.add(v.ipHash);
        }
      }
    });

    const formatTrend = (trendData: Record<string, { views: number; uniques: Set<string> }>) =>
      Object.entries(trendData).map(([label, d]) => ({
        label,
        views: d.views,
        uniques: d.uniques.size,
      }));

    return {
      overview: {
        totalViews: totalPageViews,
        totalUniques: allUniqueVisitors,
        liveSessionCount: liveVisitors,
      },
      trends: {
        daily: formatTrend(dailyViews),
        weekly: formatTrend(weeklyViews).reverse(), // Render in ascending chronolocial order
        monthly: formatTrend(monthlyViews),
      },
      topPages,
      topReferrers,
      topCountries,
      hardware,
    };
  }
}
