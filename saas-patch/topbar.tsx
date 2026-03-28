'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/systems': 'AI Systems',
  '/dashboard/systems/new': 'Register New System',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  // Exact match
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // System detail pages
  if (pathname.match(/^\/dashboard\/systems\/[^/]+$/)) return 'System Overview';
  if (pathname.includes('/classify')) return 'Risk Classification';
  if (pathname.includes('/obligations')) return 'Obligations';
  if (pathname.includes('/assess')) return 'Governance Assessment';
  if (pathname.includes('/roadmap')) return 'Action Roadmap';

  return 'Hexis';
}

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 flex items-center justify-between px-6 lg:px-8 border-b border-rule bg-charcoal no-print">
      <h2 className="font-heading text-base text-dark-type">{title}</h2>

      {/* AI Advisor indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-dark-sub">
          <div className="w-1.5 h-1.5 bg-brass" />
          <span className="label-upper">AI Advisor Active</span>
        </div>
      </div>
    </header>
  );
}
