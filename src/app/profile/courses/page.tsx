import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { courses: { include: { course: true } } },
  });

  if (!user) return <div>Пользователь не найден</div>;

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Мои курсы</h1>

      {user.courses.length === 0 ? (
        <p className="text-sm text-slate-500">Вы ещё не записаны на курсы. Перейдите в <Link href="/courses" className="text-blue-600 hover:underline">каталог</Link>.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {user.courses.map((uc) => (
            <div key={uc.id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col justify-between transition-colors">
              <div>
                {/* ДОБАВЛЕНО: dark:text-white */}
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{uc.course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{uc.course.description}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Записан: {uc.enrolledAt.toLocaleDateString('ru-RU')}
                </span>
                <Link href={`/courses/${uc.course.id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Перейти →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}