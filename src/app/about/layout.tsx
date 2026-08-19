// This layout.tsx wraps the About page and exports metadata for it.
// The actual page.tsx is a client component so metadata lives here.
import { aboutMetadata } from './metadata';
export { aboutMetadata as metadata };

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import React from 'react';
