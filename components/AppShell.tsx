import { EnterpriseSidebar } from '@/components/EnterpriseSidebar';
import { getSessionUser } from '@/lib/auth';

function PortalShell({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();

  return (
    <div className="flex min-h-[calc(100vh-72px)] w-full bg-slate-50">
      <EnterpriseSidebar
        user={
          user
            ? {
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                picture: user.picture,
                loginMethod: user.loginMethod
              }
            : null
        }
      />
      <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-6 xl:px-8">
        {children}
      </section>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
