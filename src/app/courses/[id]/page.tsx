import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { enrollInCourse } from '@/app/actions/course';

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const course = await prisma.course.findUnique({
    where: { id },
    include: { 
      tests: true,
      articles: { orderBy: { sortOrder: 'asc' } }
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  if (session?.user?.id) {
    const enrollment = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: { 
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  async function handleEnroll() {
    'use server';
    await enrollInCourse(course!.id);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Шапка курса */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 transition-colors">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{course.title}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{course.description}</p>
        
        {!session ? (
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Для доступа к курсу необходима авторизация
          </Link>
        ) : isEnrolled ? (
          <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-3 rounded-md inline-block font-medium">
            ✓ Вы записаны на этот курс
          </div>
        ) : (
          <form action={handleEnroll}>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Записаться на курс
            </button>
          </form>
        )}
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Программа курса (Статьи в виде аккордеона) */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Интерактивная программа курса</h2>
          <div className="space-y-4">
            {course.articles.map((article, index) => (
              <details 
                key={article.id} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm group transition-colors"
              >
                <summary className="bg-blue-50 dark:bg-slate-700/50 p-4 font-semibold text-blue-900 dark:text-blue-100 cursor-pointer flex items-center justify-between list-none hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </span>
                    {article.title}
                  </div>
                  <span className="text-xs text-blue-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                
                <div className="p-4">
                  {/* Если у статьи есть обложка (загруженная отдельно), показываем её */}
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full max-h-64 object-cover rounded-lg mb-4" 
                    />
                  )}
                  
                  {/* ВЫВОДИМ HTML-КОНТЕНТ ИЗ РЕДАКТОРА */}
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                  />
                </div>
              </details>
            ))}
            {course.articles.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">Материалы курса пока не добавлены.</p>
            )}
          </div>
        </div>

        {/* Блок с тестами */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Тестирование</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-3 transition-colors">
            {course.tests.map((test) => (
              <div key={test.id} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                <h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">{test.title}</h3>
                <Link 
                  href={`/tests/${test.id}`} 
                  className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Пройти тест
                </Link>
                
                {isAdmin && (
                  <Link 
                    href={`/profile/admin/courses/${course.id}/tests/${test.id}`} 
                    className="block mt-2 text-xs text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-center"
                  >
                    Управление тестом
                  </Link>
                )}
              </div>
            ))}
            {course.tests.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Тесты еще не добавлены.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}