'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userName: string;
  orgName: string;
}

const NAV_ITEMS = [
  {
    label: 'DASHBOARD',
    href: '/dashboard',
    description: 'Overview',
  },
  {
    label: 'AI SYSTEMS',
    href: '/systems',
    description: 'Inventory',
  },
  {
    label: 'REPORTS',
    href: '/reports',
    description: 'PDF Export',
  },
  {
    label: 'SETTINGS',
    href: '/settings',
    description: 'Account',
  },
];

const ORIENT_STEPS = [
  { letter: 'O', label: 'Observe', step: 1 },
  { letter: 'R', label: 'Risk', step: 2 },
  { letter: 'I', label: 'Identify', step: 3 },
  { letter: 'E', label: 'Evaluate', step: 4 },
  { letter: 'N', label: 'Navigate', step: 5 },
  { letter: 'T', label: 'Track', step: 6 },
];

export function Sidebar({ userName, orgName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen flex flex-col border-r border-border bg-charcoal no-print">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-border">
        <h1 className="font-heading text-lg text-dark-type tracking-wide">
          HEXIS
        </h1>
        <p className="label-upper mt-1">{orgName}</p>
      </div>

      {/* ORIENT Progress — visual indicator */}
      <div className="px-5 py-4 border-b border-border">
        <p className="label-upper mb-3">ORIENT FLOW</p>
        <div className="flex gap-1">
          {ORIENT_STEPS.map((step) => (
            <div
              key={step.letter}
              className="flex-1 text-center"
              title={`${step.letter} — ${step.label}`}
            >
              <div className="text-[10px] font-body text-dark-sub mb-1">
                {step.letter}
              </div>
              <div className="h-1 bg-border" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2.5 mb-0.5
                transition-colors duration-150
                ${isActive
                  ? 'bg-card text-dark-type border-l-2 border-l-brass'
                  : 'text-dark-sub hover:text-dark-type hover:bg-card border-l-2 border-l-transparent'
                }
              `}
            >
              <span className="label-upper">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-sm text-dark-type truncate">{userName}</p>
        <p className="label-upper mt-0.5">Pro Plan</p>
      </div>
    </aside>
  );
}
