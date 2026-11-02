import { prisma } from '@/lib/prisma';
import { createQuestion } from '@/app/actions/admin';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';

export default async function AdminTestPage({ 
  params 
}: { 
  params: Promise<{ id: string, testId: string }> 
}) {
  await requireAdmin();
  const { id: courseId, testId } = await params;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        include: { answers: true },
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!test) notFound();

  async function handleCreateQuestion(formData: FormData) {
    'use server';
    await createQuestion(testId, courseId, formData);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Тест: {test.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{test.description}</p>
        </div>
        <Link href={`/profile/admin/courses/${courseId}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
          ← Назад к курсу
        </Link>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        {/* Список вопросов */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Вопросы ({test.questions.length})</h2>
          <div className="space-y-4">
            {test.questions.map((q, index) => (
              <div key={q.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="font-medium mb-3 text-slate-900 dark:text-white">{index + 1}. {q.text}</div>
                <ul className="space-y-1">
                  {q.answers.map((a) => (
                    <li key={a.id} className={`text-sm px-3 py-1.5 rounded ${
                      a.isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {a.text} {a.isCorrect && '✓'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {test.questions.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                Вопросов пока нет. Добавьте первый!
              </p>
            )}
          </div>
        </div>

        {/* Форма добавления вопроса */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-fit sticky top-24 border border-slate-200 dark:border-slate-700 transition-colors">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Добавить вопрос</h2>
          <form action={handleCreateQuestion} className="space-y-3">
            <div>
              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Текст вопроса</label>
              <textarea 
                name="text" 
                required 
                rows={2} 
                className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
              />
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
              <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">Варианты ответов (выберите правильный)</label>
              
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center gap-2 mb-2">
                  <input type="radio" name="correct" value={num} required={num === 1} className="accent-blue-600" />
                  <input 
                    name={`answer${num}`} 
                    placeholder={`Вариант ${num}`} 
                    required 
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2 transition-colors">
              Сохранить вопрос
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}