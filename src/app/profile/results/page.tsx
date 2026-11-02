import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function MyResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Запрашиваем результаты с информацией о тесте и курсе
  const results = await prisma.testResult.findMany({
    where: { userId: session.user.id },
    include: {
      test: {
        include: { course: true }
      }
    },
    orderBy: { completedAt: 'desc' },
  });

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Результаты тестов</h1>

      {results.length === 0 ? (
        <p className="text-sm text-slate-500">
          Вы еще не проходили тесты. Перейдите в <Link href="/courses" className="text-blue-600 hover:underline">каталог курсов</Link>, чтобы начать обучение.
        </p>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const percentage = Math.round((result.score / result.total) * 100);

            let badgeColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            if (percentage < 50) badgeColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            else if (percentage < 80) badgeColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

            return (
              <div key={result.id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                <div>
                  {/* ДОБАВЛЕНО: dark:text-white */}
                  <h3 className="font-semibold text-slate-800 dark:text-white">{result.test.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Курс: <Link href={`/courses/${result.test.courseId}`} className="text-blue-600 dark:text-blue-400 hover:underline">{result.test.course.title}</Link>
                  </p>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Пройден: {result.completedAt.toLocaleDateString('ru-RU')} в {result.completedAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Результат</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{result.score} из {result.total}</div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg font-bold text-lg ${badgeColor}`}>
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}