import { SidebarInset } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import { currentUser } from '@/lib/auth';
import { NavUser } from './nav-user';

interface AppNavbarProps {
  children: ReactNode;
  adminSidebar?: ReactNode;
  userSidebar?: ReactNode;
}

export async function AppNavbar({ children, adminSidebar, userSidebar }: AppNavbarProps) {
  const user = await currentUser();

  return (
    <>
      {userSidebar && (
        <div className="hidden md:block">{userSidebar}</div>
      )}
      <SidebarInset className="flex flex-col">
        <header className="relative flex h-16 w-full items-center border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm shadow-lg px-6">
          {/* Contenedor flexible con ml-auto para empujar NavUser a la derecha */}
          <div className="ml-auto">
            <NavUser
              userNav={{
                avatar: user?.image ?? '',
                email: user?.email ?? '',
                name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
              }}
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}
