import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteCourse } from '@/app/actions/admin';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{"Админ-панель"}</h1>
        <Link href="/admin/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          {"+ Создать курс"}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b">
              <th className="p-4 font-medium">{"Название курса"}</th>
              <th className="p-4 font-medium">{"Тестов"}</th>
              <th className="p-4 font-medium">{"Записалось"}</th>
              <th className="p-4 font-medium">{"Дата создания"}</th>
              <th className="p-4 font-medium text-right">{"Действия"}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{course.title}</td>
                <td className="p-4">{course._count.tests}</td>
                <td className="p-4">{course._count.userCourses}</td>
                <td className="p-4 text-sm text-slate-500">
                  {course.createdAt.toLocaleDateString('ru-RU')}
                </td>
                
                <td className="p-4">
                  <div className="flex justify-end gap-3 items-center">
                    <Link href={`/admin/courses/${course.id}`} className="text-blue-600 hover:underline text-sm">
                      {"Управление"}
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
                <td colSpan={5} className="p-8 text-center text-slate-500">{"Курсов пока нет"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}