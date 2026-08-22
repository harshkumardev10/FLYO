import React from 'react';
import FlyoLoader from '@/components/ui/FlyoLoader';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <FlyoLoader size="lg" label="Loading..." />
    </div>
  );
}
