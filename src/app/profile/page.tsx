import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <div className="text-center py-10">Пользователь не найден</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Профиль</h1>
        <Link 
          href="/profile/edit" 
          className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Редактировать
        </Link>
      </div>

      {/* Сетка с данными */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Имя" value={user.name} />
        <Field label="Фамилия" value={user.familyname} />
        <Field label="Отчество" value={user.surname} />
        <Field label="Email" value={user.email} />
        <Field label="Телефон" value={user.phone} />
        <Field label="Целевая аудитория" value={user.targetaudiencecategory} />
        <Field label="Муниципальное образование" value={user.municipalformation} />
        <Field label="Место работы" value={user.placeofwork} />
      </div>
    </>
  );
}

// ОБНОВЛЕННЫЙ КОМПОНЕНТ FIELD
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <div className="border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
        {value || 'Не указано'}
      </div>
    </div>
  );
}