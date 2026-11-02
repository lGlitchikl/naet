import { prisma } from '@/lib/prisma';
import { createTest, createArticle, deleteArticle } from '@/app/actions/admin';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor'; // <-- Импорт редактора

export default async function AdminCoursePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  await requireAdmin();

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: { 
      tests: true,
      articles: { orderBy: { sortOrder: 'asc' } }
    }
  });

  if (!course) notFound();

  async function handleCreateTest(formData: FormData) {
    'use server';
    await createTest(course!.id, formData);
  }

  async function handleCreateArticle(formData: FormData) {
    'use server';
    await createArticle(course!.id, formData);
  }

  async function handleDeleteArticle(formData: FormData) {
    'use server';
    const articleId = formData.get('articleId') as string;
    await deleteArticle(articleId, course!.id);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Курс: {course.title}</h1>
        <Link href="/profile/admin/courses" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
          ← Назад к курсам
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА: Списки тестов и статей */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Блок тестов */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Тесты</h2>
            <div className="space-y-3">
              {course.tests.map((test) => (
                <div key={test.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex justify-between items-center border border-slate-200 dark:border-slate-700 transition-colors">
                  <span className="font-medium text-slate-900 dark:text-white">{test.title}</span>
                  <Link href={`/profile/admin/courses/${course.id}/tests/${test.id}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    Управление
                  </Link>
                </div>
              ))}
              {course.tests.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Тестов пока нет</p>}
            </div>
          </div>

          {/* Блок статей */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Материалы (Статьи)</h2>
            <div className="space-y-3">
              {course.articles.map((article) => (
                <div key={article.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-3 transition-colors">
                  <div>
                    <div className="font-medium mb-1 text-slate-900 dark:text-white">{article.title}</div>
                    {/* Показываем первые 100 символов, очищенных от HTML тегов */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {article.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Link 
                      href={`/profile/admin/courses/${course.id}/articles/${article.id}/edit`}
                      className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Редактировать
                    </Link>
                    <form action={handleDeleteArticle}>
                      <input type="hidden" name="articleId" value={article.id} />
                      <button 
                        type="submit"
                        className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Удалить
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {course.articles.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Материалов пока нет</p>}
            </div>
          </div>

        </div>

        {/* ПРАВАЯ КОЛОНКА: Формы добавления */}
        <div className="space-y-8">
          
          {/* Форма создания теста */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-fit border border-slate-200 dark:border-slate-700 transition-colors">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Добавить тест</h2>
            <form action={handleCreateTest} className="space-y-4">
              <input 
                name="title" 
                placeholder="Название теста" 
                required 
                className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
              />
              <textarea 
                name="description" 
                placeholder="Описание" 
                rows={2} 
                className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
              />
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Создать тест
              </button>
            </form>
          </div>

          {/* Форма создания статьи */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-fit border border-slate-200 dark:border-slate-700 transition-colors">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Добавить материал (статью)</h2>
            <form action={handleCreateArticle} className="space-y-4">
              <input 
                name="title" 
                placeholder="Название статьи" 
                required 
                className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400" 
              />
              
              {/* ВМЕСТО TEXTAREA ТЕПЕРЬ RICH TEXT EDITOR */}
              <RichTextEditor name="content" />

              {/* Поле для загрузки обложки статьи (если хотите оставить) */}
              <div className="relative">
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
                    border border-slate-200 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-900"
                />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Сохранить статью
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}