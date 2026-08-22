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

/**
 * Workspace layout intentionally overrides the root layout's <Header> and <Footer>
 * so the workspace has a completely isolated shell (no public nav/footer visible).
 * The root layout wraps children in <main class="flex-1">, so we still receive that wrapper,
 * but we negate its padding / margin here with a full-bleed style.
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
      {children}
    </div>
  );
}
