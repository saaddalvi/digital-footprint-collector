import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function IconButton({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  ...props 
}: IconButtonProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const variants = {
    primary: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700',
    ghost: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
  };

  return (
    <button
      className={`${sizes[size]} ${variants[variant]} rounded-lg flex items-center justify-center transition-all ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}