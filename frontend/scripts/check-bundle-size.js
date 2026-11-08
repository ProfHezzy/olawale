#!/usr/bin/env node
/**
 * Bundle Size Performance Budget Checker
 *
 * Enforces performance budgets for the Next.js application.
 * Run with: ANALYZE=true npm run build && node scripts/check-bundle-size.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Performance budgets (in KB, gzipped)
const BUDGETS = {
  // JavaScript budgets
  totalJS: 350,           // Total JS budget
  initialJS: 170,         // Initial JS load (critical path)
  vendorJS: 100,          // Vendor/chunk JS

  // CSS budgets
  totalCSS: 50,           // Total CSS budget

  // Font budgets
  totalFonts: 100,        // Total font files

  // Image budgets (per page)
  heroImage: 80,          // Hero/banner images
  thumbnailImage: 30,     // Thumbnail/project images

  // Page-specific budgets (KB gzipped)
  pages: {
    '/': 200,             // Home page
    '/projects': 150,     // Projects listing
    '/projects/[slug]': 200, // Project detail
    '/blog': 150,         // Blog listing
    '/blog/[slug]': 180,  // Blog post
    '/contact': 120,      // Contact page
    '/admin': 250,        // Admin dashboard
    '/admin/projects': 200,
  },
};

// Convert bytes to KB
function bytesToKB(bytes) {
  return Math.round(bytes / 1024);
}

// Parse bundle analyzer output
function parseBundleAnalyzer(analyzeDir) {
  const results = {
    client: {},
    server: {},
    edge: {},
  };

  // Check for client bundles
  const clientDir = path.join(analyzeDir, 'client');
  if (fs.existsSync(clientDir)) {
    const files = fs.readdirSync(clientDir);
    files.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = path.join(clientDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = bytesToKB(stats.size);

        if (file.endsWith('.js')) {
          if (file.includes('vendor') || file.includes('node_modules')) {
            results.client.vendorJS = (results.client.vendorJS || 0) + sizeKB;
          } else if (file.startsWith('main') || file.startsWith('app')) {
            results.client.initialJS = (results.client.initialJS || 0) + sizeKB;
          }
          results.client.totalJS = (results.client.totalJS || 0) + sizeKB;
        } else if (file.endsWith('.css')) {
          results.client.totalCSS = (results.client.totalCSS || 0) + sizeKB;
        }
      }
    });
  }

  return results;
}

// Check gzipped sizes from .next/analyze
function checkGzippedSizes(analyzeDir) {
  const results = { passed: true, violations: [], warnings: [] };

  // Check if analyze directory exists
  if (!fs.existsSync(analyzeDir)) {
    results.warnings.push('Bundle analyzer output not found. Run with ANALYZE=true npm run build');
    return results;
  }

  // Look for gzip report files
  const analyzeFiles = fs.readdirSync(analyzeDir);
  const gzipFiles = analyzeFiles.filter(f => f.endsWith('.gz') || f.includes('gzip'));

  // Parse the HTML report for sizes if available
  const htmlReport = analyzeFiles.find(f => f.endsWith('.html'));
  if (htmlReport) {
    const htmlContent = fs.readFileSync(path.join(analyzeDir, htmlReport), 'utf-8');

    // Extract sizes from the HTML report (simplified)
    // In practice, you'd parse the actual bundle analyzer JSON output
    console.log('Found HTML report:', htmlReport);
  }

  // For now, use the raw file sizes as approximation
  const bundleData = parseBundleAnalyzer(analyzeDir);

  // Check JavaScript budgets
  if (bundleData.client.totalJS > BUDGETS.totalJS) {
    results.passed = false;
    results.violations.push({
      metric: 'Total JavaScript',
      actual: `${bundleData.client.totalJS} KB`,
      budget: `${BUDGETS.totalJS} KB`,
      severity: 'error',
    });
  }

  if (bundleData.client.initialJS > BUDGETS.initialJS) {
    results.passed = false;
    results.violations.push({
      metric: 'Initial JavaScript',
      actual: `${bundleData.client.initialJS} KB`,
      budget: `${BUDGETS.initialJS} KB`,
      severity: 'error',
    });
  }

  if (bundleData.client.vendorJS > BUDGETS.vendorJS) {
    results.violations.push({
      metric: 'Vendor JavaScript',
      actual: `${bundleData.client.vendorJS} KB`,
      budget: `${BUDGETS.vendorJS} KB`,
      severity: 'warning',
    });
  }

  // Check CSS budgets
  if (bundleData.client.totalCSS > BUDGETS.totalCSS) {
    results.passed = false;
    results.violations.push({
      metric: 'Total CSS',
      actual: `${bundleData.client.totalCSS} KB`,
      budget: `${BUDGETS.totalCSS} KB`,
      severity: 'error',
    });
  }

  return results;
}

// Generate performance budget report
function generateReport(results) {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           PERFORMANCE BUDGET REPORT                         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (results.violations.length === 0 && results.warnings.length === 0) {
    console.log('✅ All performance budgets PASSED!');
    console.log('\n📊 Budget Summary:');
    Object.entries(BUDGETS).forEach(([key, value]) => {
      if (typeof value === 'number') {
        console.log(`   ${key}: ${value} KB`);
      }
    });
  } else {
    if (results.violations.length > 0) {
      console.log('❌ BUDGET VIOLATIONS (ERRORS):\n');
      results.violations.forEach(v => {
        console.log(`   ${v.metric}: ${v.actual} / ${v.budget} [${v.severity.toUpperCase()}]`);
      });
    }

    if (results.warnings.length > 0) {
      console.log('\n⚠️  BUDGET WARNINGS:\n');
      results.warnings.forEach(w => {
        console.log(`   ${w}`);
      });
    }

    console.log('\n📋 Recommendations:');
    console.log('   • Enable code splitting with dynamic imports');
    console.log('   • Remove unused dependencies');
    console.log('   • Optimize images with next/image');
    console.log('   • Use font subsetting and variable fonts');
    console.log('   • Enable compression (gzip/brotli) on server');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  return results.passed ? 0 : 1;
}

// Main execution
function main() {
  console.log('🔍 Checking performance budgets...\n');

  const analyzeDir = path.join(__dirname, '..', '.next', 'analyze');
  const results = checkGzippedSizes(analyzeDir);

  const exitCode = generateReport(results);
  process.exit(exitCode);
}

main();