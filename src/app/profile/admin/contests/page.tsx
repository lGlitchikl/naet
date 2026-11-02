import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createContest, deleteContest } from '@/app/actions/contest';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';

export default async function AdminContestsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/profile');

  const contests = await prisma.contest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function handleCreateContest(formData: FormData) {
    'use server';
    await createContest(formData);
  }

  async function handleDeleteContest(formData: FormData) {
    'use server';
    const contestId = formData.get('contestId') as string;
    await deleteContest(contestId);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Список конкурсов */}
      <div className="lg:col-span-2">
        <h1 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Управление конкурсами</h1>
        <div className="space-y-3">
          {contests.map((contest) => (
            <div key={contest.id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 rounded-lg flex justify-between items-center transition-colors">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{contest.title}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{contest.description}</div>
              </div>
              
              <div className="flex items-center gap-4">
                {contest.externalUrl && (
                  <a href={contest.externalUrl} target="_blank" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    Ссылка
                  </a>
                )}
                
                {/* Форма удаления */}
                <form action={handleDeleteContest}>
                  <input type="hidden" name="contestId" value={contest.id} />
                  <DeleteButton />
                </form>
              </div>
            </div>
          ))}
          {contests.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-sm">Конкурсов пока нет</p>}
        </div>
      </div>

      {/* Форма создания */}
      <div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit transition-colors">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Добавить конкурс</h2>
          <form action={handleCreateContest} className="space-y-4">
            <input 
              name="title" 
              placeholder="Название конкурса" 
              required 
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
            />
            <textarea 
              name="description" 
              placeholder="Описание" 
              rows={3} 
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
            />
            <input 
              name="externalUrl" 
              placeholder="Ссылка на сайт конкурса (https://...)" 
              required 
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
            />
            <input 
                type="file" 
                name="image" 
                accept="image/*" 
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-slate-700 dark:file:text-slate-200
                  dark:hover:file:bg-slate-600
                  border border-slate-200 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-900 transition-colors"
              />
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Создать конкурс
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}