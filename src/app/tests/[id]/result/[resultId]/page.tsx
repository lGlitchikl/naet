import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ResultPage({ 
  params 
}: { 
  params: Promise<{ id: string, resultId: string }> 
}) {
  const { id: testId, resultId } = await params;

  const result = await prisma.testResult.findUnique({
    where: { id: resultId },
    include: { test: true }
  });

  if (!result) notFound();

  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        
        {/* Заголовок и название теста */}
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
          Тест завершён!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {result.test.title}
        </p>

        {/* Кружок с процентами */}
        <div className="w-32 h-32 mx-auto rounded-full border-8 border-blue-500 dark:border-blue-400 flex items-center justify-center mb-6">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {percentage}%
          </span>
        </div>

        {/* Статистика */}
        <p className="text-lg mb-6 text-slate-700 dark:text-slate-300">
          Правильных ответов: <strong className="text-slate-900 dark:text-white">{result.score}</strong> из <strong className="text-slate-900 dark:text-white">{result.total}</strong>
        </p>

        <Link 
          href={`/courses/${result.test.courseId}`} 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться к курсу
        </Link>
      </div>
    </div>
  );
}