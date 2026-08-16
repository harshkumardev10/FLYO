'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface GSAPWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'staggerChildren';
  delay?: number;
  className?: string;
}

export function GSAPWrapper({
  children,
  animation = 'slideUp',
  delay = 0,
  className = '',
}: GSAPWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (animation === 'slideUp') {
      gsap.fromTo(
        element,
        { opacity: 0.3, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay, ease: 'power2.out' }
      );
    } else if (animation === 'fadeIn') {
      gsap.fromTo(
        element,
        { opacity: 0.3 },
        { opacity: 1, duration: 0.4, delay, ease: 'power1.out' }
      );
    } else if (animation === 'staggerChildren') {
      const childrenElements = element.children;
      if (childrenElements.length > 0) {
        gsap.fromTo(
          Array.from(childrenElements),
          { opacity: 0.3, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, delay, stagger: 0.08, ease: 'power2.out' }
        );
      }
    }
  }, [animation, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
