import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Admin Portal | Protected',
  description: 'Internal partner workspace and article publishing portal.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
