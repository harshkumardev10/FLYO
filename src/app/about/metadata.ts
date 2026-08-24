import type { Metadata } from 'next';

export const aboutMetadata: Metadata = {
  title: 'About Us – Student Startup',
  description: 'flyoo businesses (flyoo / flyo) is a student-led digital studio founded by Harsh Kumar at GLA University in Mathura.',
  keywords: [
    'flyoo about', 'flyoo founder', 'Harsh Kumar', 'Harsh Kumar GLA University',
    'GLA University startup', 'student startup Mathura', 'flyo digital founder',
    'flyoo digital studio', 'who is flyoo', 'flyoo team',
  ],
  openGraph: {
    title: 'About Us – Student Startup | flyoo businesses',
    description: 'flyoo businesses is a student-led digital studio founded by Harsh Kumar at GLA University in Mathura.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://flyoo.vercel.app/about',
    languages: {
      'en-IN': 'https://flyoo.vercel.app/about',
      'en': 'https://flyoo.vercel.app/about',
      'x-default': 'https://flyoo.vercel.app/about',
    },
  },
};
