import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteCourse } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/profile');

  const courses = await prisma.course.findMany({
    include: { _count: { select: { tests: true, userCourses: true } } },
    orderBy: { createdAt: 'desc' },
  });

  async function handleDeleteCourse(formData: FormData) {
    'use server';
    const courseId = formData.get('courseId') as string;
    await deleteCourse(courseId);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Управление курсами</h1>
        <Link href="/profile/admin/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm transition-colors">
          + Создать курс
        </Link>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 font-medium">Название</th>
              <th className="p-4 font-medium">Тестов</th>
              <th className="p-4 font-medium">Записалось</th>
              <th className="p-4 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-slate-900 dark:text-white">
                  {course.title}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {course._count.tests}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {course._count.userCourses}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-3 items-center">
                    <Link href={`/profile/admin/courses/${course.id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      Управление
                    </Link>
                    <form action={handleDeleteCourse}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Курсов пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}