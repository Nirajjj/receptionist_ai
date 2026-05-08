'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, History } from 'lucide-react';

// Centralized navigation data (Easy to update later)
const navItems = [
  { name: 'Home', href: '/admin/dashboard', icon: Home },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Clients', href: '/admin/clients', icon: Users }, // Renamed from Patients for SaaS flexibility
  { name: 'Logs', href: '/admin/logs', icon: History },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    // pb-safe ensures it doesn't get hidden behind the iPhone home indicator line
    <div className="pb-safe flex h-[68px] w-full items-center justify-around px-2">
      {navItems.map((item) => {
        // Check if the current URL matches the link's href
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            // Touch target size is optimized for mobile tapping
            className={`flex h-full min-w-[64px] flex-col items-center justify-center transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon
              className="mb-1 h-5 w-5"
              // Thicker stroke when active makes it pop visually
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-[10px] leading-none font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
