import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createNews, deleteNews } from '@/app/actions/news';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminNewsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/profile');

  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function handleCreateNews(formData: FormData) {
    'use server';
    await createNews(formData);
  }

  async function handleDeleteNews(formData: FormData) {
    'use server';
    const id = formData.get('newsId') as string;
    await deleteNews(id);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Список новостей */}
      <div className="lg:col-span-2">
        <h1 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Управление новостями</h1>
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 rounded-lg flex justify-between items-center transition-colors">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.createdAt.toLocaleDateString('ru-RU')}
                </div>
              </div>
              
              <form action={handleDeleteNews}>
                <input type="hidden" name="newsId" value={item.id} />
                <DeleteButton />
              </form>
            </div>
          ))}
          {news.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-sm">Новостей пока нет</p>}
        </div>
      </div>

      {/* Форма создания */}
      <div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit transition-colors">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Добавить новость</h2>
          <form action={handleCreateNews} className="space-y-4">
            <input 
              name="title" 
              placeholder="Заголовок новости" 
              required 
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
            />
            <textarea 
              name="content" 
              placeholder="Текст новости" 
              rows={5} 
              required 
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
            />
            <input 
              name="externalUrl" 
              placeholder="Ссылка (https://...)" 
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
              Опубликовать
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}