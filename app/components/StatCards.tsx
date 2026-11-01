'use client';

import { useMemo } from 'react';
import { Users, Check, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { Student } from '../types';

interface StatCardsProps {
  students: Student[];
}

interface StatCardProps {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string | number;
  trend: { value: string; label: string; class: string };
}

function StatCard({ icon, iconClass, label, value, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={iconClass}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={trend.class}>
          {trend.value} {trend.label && <em>{trend.label}</em>}
        </small>
      </div>
    </div>
  );
}

export function StatCards({ students }: StatCardsProps) {
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'Active').length;
    const pending = students.filter((s) => s.status === 'Inactive').length;
    const classes = new Set(students.map((s) => s.className)).size;

    return [
      {
        icon: <Users aria-hidden="true" />,
        iconClass: 'stat-icon green',
        label: 'Total students',
        value: total,
        trend: { value: `${total} enrolled`, label: 'in system', class: 'up' },
      },
      {
        icon: <Check aria-hidden="true" />,
        iconClass: 'stat-icon blue',
        label: 'Active cards',
        value: active,
        trend: { value: `${Math.round((active / (total || 1)) * 100)}%`, label: 'verified', class: 'up' },
      },
      {
        icon: <FileSpreadsheet aria-hidden="true" />,
        iconClass: 'stat-icon amber',
        label: 'Inactive / Pending',
        value: pending,
        trend: {
          value: pending > 0 ? `${pending} need review` : 'All clear',
          label: '',
          class: pending > 0 ? 'down' : 'up',
        },
      },
      {
        icon: <BarChart3 aria-hidden="true" />,
        iconClass: 'stat-icon purple',
        label: 'Active classes',
        value: classes,
        trend: { value: `${classes} cohorts`, label: 'represented', class: 'neutral' },
      },
    ];
  }, [students]);

  return (
    <div className="stat-grid">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}