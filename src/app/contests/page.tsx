import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ContestsPage() {
  const contests = await prisma.contest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Конкурсы для граждан
      </h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
            <div className="h-40 bg-slate-100 dark:bg-slate-700">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                  Нет обложки
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-3">{c.description}</p>
              
              {c.externalUrl ? (
                <a 
                  href={c.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Подробнее
                </a>
              ) : (
                <button disabled className="block text-center bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 py-2 rounded text-sm cursor-not-allowed">
                  Ссылка скоро появится
                </button>
              )}
            </div>
          </div>
        ))}
        {contests.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 col-span-full">Конкурсов пока нет</p>
        )}
      </div>
    </div>
  );
}