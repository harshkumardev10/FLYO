import { TeamMember } from '@/lib/types/seo';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'alex-rivers',
    name: 'Alex Rivers',
    role: 'Founder & Tech Lead',
    bio: 'Computer Science senior with a passion for web engineering and local business growth. Alex leads technical strategy and Next.js development.',
    college: 'UT Austin CS Class of 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    visible: true,
    order: 0,
  },
  {
    id: 'sam-vance',
    name: 'Sam Vance',
    role: 'Lead Web Designer',
    bio: 'Design student focused on visual layout, typography, and user experience. Sam ensures every website and poster looks clean and modern.',
    college: 'Design & Visual Arts Senior',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    visible: true,
    order: 1,
  },
  {
    id: 'maya-lin',
    name: 'Maya Lin',
    role: 'Content & Social Lead',
    bio: 'Communications major dedicated to creating authentic brand copy, social media graphics, and community engagement campaigns.',
    college: 'Advertising & PR Junior',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    visible: true,
    order: 2,
  },
  {
    id: 'jordan-reed',
    name: 'Jordan Reed',
    role: 'Strategy & Media',
    bio: 'Business and marketing enthusiast who loves helping local shop owners build clear promotional plans that actually work.',
    college: 'Business Administration Senior',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    visible: true,
    order: 3,
  },
];
