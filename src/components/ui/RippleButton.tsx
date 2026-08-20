'use client';

import React, { useRef, useCallback } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
  className?: string;
}

/**
 * A <button> with a ripple click effect.
 * Wrap any button with this instead of <button> to get tactile click feedback.
 */
export function RippleButton({
  children,
  rippleColor = 'rgba(255,255,255,0.55)',
  className = '',
  onClick,
  ...props
}: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = btnRef.current;
      if (!btn) return;

      // Create ripple element
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${rippleColor};
        pointer-events: none;
        width: 60px; height: 60px;
        left: ${x}px; top: ${y}px;
        margin-left: -30px; margin-top: -30px;
        animation: ripple-burst 0.55s ease-out forwards;
        z-index: 10;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);

      onClick?.(e);
    },
    [onClick, rippleColor]
  );

  return (
    <button
      ref={btnRef}
      className={`active:scale-95 transition-transform duration-100 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

interface RippleLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  rippleColor?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * A Next.js-style anchor wrapper with ripple effect.
 * Use this for CTA link-buttons that use <a> or Next.js <Link>.
 */
export function useRipple(rippleColor = 'rgba(255,255,255,0.55)') {
  const handleRipple = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${rippleColor};
        pointer-events: none;
        width: 60px; height: 60px;
        left: ${x}px; top: ${y}px;
        margin-left: -30px; margin-top: -30px;
        animation: ripple-burst 0.55s ease-out forwards;
        z-index: 10;
      `;

      // Ensure container can clip the ripple
      const prevPosition = el.style.position;
      const prevOverflow = el.style.overflow;
      if (!['relative', 'absolute', 'fixed', 'sticky'].includes(getComputedStyle(el).position)) {
        el.style.position = 'relative';
      }
      el.style.overflow = 'hidden';
      el.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        el.style.position = prevPosition;
        el.style.overflow = prevOverflow;
      }, 600);
    },
    [rippleColor]
  );

  return handleRipple;
}
