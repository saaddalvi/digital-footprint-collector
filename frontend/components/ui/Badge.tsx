import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'sm' 
}: BadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variants = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400',
    default: 'bg-indigo-500/20 text-indigo-300'
  };

  return (
    <span className={`${sizes[size]} ${variants[variant]} rounded-full font-medium`}>
      {children}
    </span>
  );
}