import React from 'react';
import Card from './Card';

interface StatCardProps {
  value: string | number;
  label: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export default function StatCard({ value, label, variant = 'default' }: StatCardProps) {
  return (
    <Card variant={variant}>
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </Card>
  );
}