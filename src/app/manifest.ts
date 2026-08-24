import { MetadataRoute } from 'next';
import { COMPANY_INFO } from '@/lib/data/company';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'flyoo businesses | Make Your Business Fly & Grow Online',
    short_name: 'flyoo',
    description: COMPANY_INFO.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/favicon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
