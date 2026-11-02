import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { updateProfile } from '@/app/actions/profile';
import Link from 'next/link';

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <div className="text-center py-10">Пользователь не найден</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Редактирование профиля</h1>
        <Link href="/profile" className="text-sm text-blue-600 hover:underline">
          ← Назад в профиль
        </Link>
      </div>

      <form action={updateProfile} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Имя</label>
            <input name="name" defaultValue={user.name} required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Фамилия</label>
            <input name="familyname" defaultValue={user.familyname} required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Отчество</label>
            <input name="surname" defaultValue={user.surname} required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Телефон</label>
            <input name="phone" defaultValue={user.phone} required className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Целевая аудитория</label>
            <input name="targetaudiencecategory" defaultValue={user.targetaudiencecategory} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Муниципальное образование</label>
            <input name="municipalformation" defaultValue={user.municipalformation} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Место работы</label>
            <input name="placeofwork" defaultValue={user.placeofwork} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}