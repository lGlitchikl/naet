import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { updateArticle } from '@/app/actions/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string, articleId: string }> 
}) {
  await requireAdmin();
  const { id: courseId, articleId } = await params;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    await updateArticle(articleId, courseId, formData);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Редактирование статьи</h1>
        <Link href={`/profile/admin/courses/${courseId}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
          ← Назад к курсу
        </Link>
      </div>

      <form action={handleUpdate} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm space-y-4 border border-slate-200 dark:border-slate-700 transition-colors">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Название статьи</label>
          <input 
            name="title" 
            defaultValue={article.title} 
            required 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Текст статьи</label>
          <textarea 
            name="content" 
            defaultValue={article.content} 
            rows={10} 
            required 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}