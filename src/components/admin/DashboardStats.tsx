'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, changeLabel, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-muted-foreground text-sm">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const defaultStats = {
    totalRevenue: 45231.89,
    totalOrders: 2350,
    totalProducts: 1284,
    totalCustomers: 573,
  };

  const data = stats || defaultStats;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        change={12.5}
        changeLabel="from last month"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        trend="up"
      />
      <StatCard
        title="Total Orders"
        value={formatNumber(data.totalOrders)}
        change={8.2}
        changeLabel="from last month"
        icon={<ShoppingCart className="h-4 w-4 text-primary" />}
        trend="up"
      />
      <StatCard
        title="Total Products"
        value={formatNumber(data.totalProducts)}
        change={-2.4}
        changeLabel="from last month"
        icon={<Package className="h-4 w-4 text-primary" />}
        trend="down"
      />
      <StatCard
        title="Total Customers"
        value={formatNumber(data.totalCustomers)}
        change={15.3}
        changeLabel="from last month"
        icon={<Users className="h-4 w-4 text-primary" />}
        trend="up"
      />
    </div>
  );
}
