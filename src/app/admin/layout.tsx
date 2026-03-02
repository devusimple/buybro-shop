import { AdminLayout } from '@/components/admin/AdminLayout';
import Auth from '@/components/auth/auth';
import db from '@/lib/db';

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <>
      <db.SignedIn>
        <AdminLayout>{children}</AdminLayout>
      </db.SignedIn>
      <db.SignedOut>
        <Auth />
      </db.SignedOut>
    </>

  )
}
