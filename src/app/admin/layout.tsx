import { AdminLayout } from '@/components/admin/AdminLayout';
import Auth from '@/components/auth/auth';
import db from '@/lib/db';
import { Loader2 } from 'lucide-react';

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {

  const { isLoading, user, error } = db.useAuth();
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className='animate-spin' />
      </div>
    ) // or a loading spinner
  }
  if (error) {
    return <div className="p-4 text-red-500">Uh oh! {error.message}</div>;
  }
  if (user) {
    return <AdminLayout>{children}</AdminLayout>
      ;
  }
  return <Auth />;
}
