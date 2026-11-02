import { auth } from '@/auth';
import ProfileNav from '@/components/ProfileNav';
import LogoutButton from '@/components/LogoutButton';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Личный кабинет
        </h1>
        <LogoutButton />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <ProfileNav isAdmin={isAdmin} />
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}