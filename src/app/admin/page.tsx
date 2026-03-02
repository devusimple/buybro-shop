'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { SalesChart } from '@/components/admin/SalesChart';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      <DashboardStats />

      <div className="grid lg:grid-cols-2 gap-8">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
}
