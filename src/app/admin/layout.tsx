import Sidebar from '@/components/admin/dashboard/layout/Sidebar';
import Header from '@/components/admin/dashboard/layout/Header';
import { Metadata } from 'next';
import MobileBottomNav from '@/components/admin/dashboard/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'ClinicalAI Dashboard',
  description: 'Medical Dashboard',
};
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex h-screen overflow-y-scroll bg-slate-50">
          <main className="flex-1 bg-slate-50 p-6 pb-17 md:pb-0">{children}</main>
        </div>
        <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white md:hidden">
          <MobileBottomNav />
        </nav>
      </div>
    </div>
  );
}
