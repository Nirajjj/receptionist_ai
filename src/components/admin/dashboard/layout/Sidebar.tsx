'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  PhoneCall,
  Settings,
  HelpCircle,
} from 'lucide-react';

// Using the SaaS-agnostic paths we discussed earlier
const topNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Availability', href: '/admin/schedule', icon: CalendarDays },
  { name: 'Call Logs', href: '/admin/logs', icon: PhoneCall },
];

const bottomNavItems = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Support', href: '/admin/support', icon: HelpCircle },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    // 'flex-col' stacks items vertically. 'h-full' ensures it spans the screen.
    <aside className="hidden h-full w-64 flex-col bg-[#1E293B] text-slate-300 md:flex">
      {/* 1. Logo Section */}
      <div className="flex h-20 flex-col justify-center px-6">
        <span className="text-xl font-bold tracking-tight text-white">ClinicalAI</span>
        <span className="text-xs font-medium text-slate-400">Medical Suite</span>
      </div>

      {/* 2. Main Navigation ('flex-1' pushes everything below it to the bottom) */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
        {topNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Actions & Secondary Nav */}
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Book Appointment Button */}
        <button className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
          Book New Appointment
        </button>

        {/* Settings & Support */}
        <div className="flex flex-col gap-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. User Profile Area */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-700">
            {/* Using a placeholder avatar - you can replace this with next/image later */}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Niraj"
              alt="Admin avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">Niraj Parab</span>
            <span className="truncate text-xs text-slate-400">System Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
