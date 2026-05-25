'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking server-side or static generation phase (client-side only checks)
    if (typeof window === 'undefined') return;

    // Determine full path
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Avoid double tracking the exact same route on incremental client-side changes
    if (lastTrackedPath.current === fullPath) {
      return;
    }
    lastTrackedPath.current = fullPath;

    // Skip tracking socket, developer hot-reload, or similar debug endpoints if they somehow fire
    if (pathname.includes('/_next/') || pathname.includes('/api/')) {
      return;
    }

    let clientCountry = 'Unknown';
    try {
      // In local development, the user's timezone can serve as a proxy location hint
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone) {
        clientCountry = timeZone;
      }
    } catch {
      // Ignore
    }

    const payload = {
      path: pathname || '/',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      clientCountry,
    };

    const trackVisit = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${apiUrl}/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch (err) {
        // Silent failure to avoid disrupting UX
      }
    };

    // Minor delay so layout paint isn't blocked
    const timer = setTimeout(trackVisit, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
