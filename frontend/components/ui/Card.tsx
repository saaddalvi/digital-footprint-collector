import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false 
}: CardProps) {
  const baseStyles = 'backdrop-blur-sm border rounded-xl p-4 transition-all';
  
  const variants = {
    default: 'bg-white/5 border-white/10',
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    info: 'bg-blue-500/10 border-blue-500/30'
  };

  const hoverEffect = hover ? 'hover:scale-105 cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
}