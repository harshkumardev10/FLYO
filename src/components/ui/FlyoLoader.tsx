import React from 'react';

interface FlyoLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string;
  className?: string;
}

export default function FlyoLoader({
  size = 'md',
  label,
  className = '',
}: FlyoLoaderProps) {
  let ringSize = 'w-12 h-12';
  let logoSize = 'w-6 h-6';
  let borderWidth = 'border-2';

  if (size === 'xs') {
    ringSize = 'w-5 h-5';
    logoSize = 'w-2.5 h-2.5';
    borderWidth = 'border-[1.5px]';
  } else if (size === 'sm') {
    ringSize = 'w-8 h-8';
    logoSize = 'w-4 h-4';
    borderWidth = 'border-2';
  } else if (size === 'lg' || size === 'fullscreen') {
    ringSize = 'w-16 h-16';
    logoSize = 'w-8 h-8';
    borderWidth = 'border-[2.5px]';
  }

  const loaderElement = (
    <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Relative container with rotating ring and centered small logo */}
      <div className={`relative ${ringSize} flex items-center justify-center flex-shrink-0`}>
        
        {/* Subtle Ambient Blue Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-sm pointer-events-none" />

        {/* Running Blue Circle around the Logo */}
        <div
          className={`absolute inset-0 rounded-full ${borderWidth} border-blue-500/20 border-t-blue-600 border-r-blue-400 animate-spin`}
          style={{ animationDuration: '0.8s' }}
        />

        {/* Small Center Kingfisher Logo */}
        <div
          className={`${logoSize} rounded-full overflow-hidden bg-white p-0.5 shadow-sm flex items-center justify-center relative z-10`}
        >
          <img
            src="/kingfisher-logo.jpg"
            alt="flyoo businesses"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Optional Label */}
      {label && (
        <span className="text-xs font-semibold text-slate-600 dark:text-blue-200 tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-[#060c1d]/95 backdrop-blur-md">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
}
