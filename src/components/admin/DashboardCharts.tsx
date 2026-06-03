'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { DashboardStats } from '@/hooks/useDashboardData';

interface DashboardChartsProps {
  stats: DashboardStats;
}

const COLORS = {
  green: '#16A34A',
  blue: '#3b82f6',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  slate: '#64748b',
};

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; fill?: string; color?: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
      {label && (
        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-gray-600 dark:text-gray-400">
          <span
            className="font-medium"
            style={{ color: entry.fill ?? entry.color }}
          >
            {entry.name}
          </span>
          : {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── 1. Property Status — donut pie ──────────────────────────────────────────

export function PropertyStatusChart({ stats }: DashboardChartsProps) {
  const rawData = [
    { name: 'Available', value: stats.availableProperties, fill: COLORS.green },
    { name: 'Rented', value: stats.rentedProperties, fill: COLORS.blue },
    { name: 'Draft / Pending', value: stats.draftProperties, fill: COLORS.amber },
  ];
  // Use a placeholder slice when all zeros so the donut renders
  const data =
    rawData.every((d) => d.value === 0)
      ? [{ name: 'No listings yet', value: 1, fill: '#e5e7eb' }]
      : rawData.filter((d) => d.value > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Property Status
        </CardTitle>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {stats.totalProperties}
          <span className="text-xs font-normal text-gray-400 ml-2">total listings</span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          {[
            { name: 'Available', value: stats.availableProperties },
            { name: 'Rented', value: stats.rentedProperties },
            { name: 'Draft', value: stats.draftProperties },
          ].map((d) => (
            <div key={d.name} className="text-center">
              <p className="text-base font-bold text-gray-900 dark:text-white">{d.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{d.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. User Breakdown — bar + mini stats ────────────────────────────────────

export function UserBreakdownChart({ stats }: DashboardChartsProps) {
  const data = [
    { name: 'Tenants', value: stats.totalTenants, fill: COLORS.blue },
    { name: 'Landlords', value: stats.totalLandlords, fill: COLORS.purple },
    { name: 'Agents', value: stats.totalAgents, fill: COLORS.green },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          User Breakdown
        </CardTitle>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {stats.totalUsers}
          <span className="text-xs font-normal text-gray-400 ml-2">
            {stats.activeUsers} active
          </span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              +{stats.newUsersThisWeek}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">this week</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              +{stats.newUsersThisMonth}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Application Pipeline — donut pie ─────────────────────────────────────

export function ApplicationStatusChart({ stats }: DashboardChartsProps) {
  const rawData = [
    { name: 'Submitted', value: stats.submittedApplications, fill: COLORS.blue },
    { name: 'Under Review', value: stats.underReviewApplications, fill: COLORS.amber },
    { name: 'Approved', value: stats.approvedApplications, fill: COLORS.green },
    { name: 'Rejected', value: stats.rejectedApplications, fill: COLORS.red },
  ];
  const data =
    rawData.every((d) => d.value === 0)
      ? [{ name: 'No applications yet', value: 1, fill: '#e5e7eb' }]
      : rawData.filter((d) => d.value > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Application Pipeline
        </CardTitle>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {stats.totalApplications}
          <span className="text-xs font-normal text-gray-400 ml-2">total</span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-base font-bold" style={{ color: COLORS.amber }}>
              {stats.submittedApplications + stats.underReviewApplications}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">needs action</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold" style={{ color: COLORS.green }}>
              {stats.approvedApplications}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">approved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Inquiries — area sparkline + status bars ──────────────────────────────

export function InquiryStatsChart({ stats }: DashboardChartsProps) {
  const statusData = [
    { name: 'Pending', value: stats.pendingInquiries, fill: COLORS.amber },
    { name: 'In Progress', value: stats.inProgressInquiries, fill: COLORS.blue },
    { name: 'Resolved', value: stats.resolvedInquiries, fill: COLORS.green },
  ];

  const areaData = statusData.map((d) => ({ name: d.name, value: d.value }));
  const hasData = statusData.some((d) => d.value > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Contact Inquiries
        </CardTitle>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {stats.totalInquiries}
          <span className="text-xs font-normal text-gray-400 ml-2">total</span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={areaData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="inqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  fill="url(#inqGrad)"
                  dot={{ fill: COLORS.blue, r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {statusData.map((d) => {
                const pct =
                  stats.totalInquiries > 0
                    ? Math.round((d.value / stats.totalInquiries) * 100)
                    : 0;
                return (
                  <div key={d.name}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {d.value} <span className="text-gray-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: d.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">No inquiries yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
