import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string; format?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const category = params.category || '';
  const level = params.level || '';
  const format = params.format || '';

  // Формируем условия для базы данных
  const where: any = {};
  
  if (q) where.title = { contains: q };
  if (category) where.category = category;
  if (level) where.level = level;
  if (format) where.format = format;

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Курсы для граждан</h1>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Фильтры */}
        <form className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 h-fit space-y-4 border border-slate-100 dark:border-slate-700" method="GET">
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Категория</h3>
          {['Основы компьютерной грамотности', 'Финансовая грамотность', 'Кибербезопасность', 'Госуслуги'].map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                value={c} 
                defaultChecked={category === c}
                className="accent-blue-600" 
              /> {c}
            </label>
          ))}

          <h3 className="font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Уровень</h3>
          <select 
            name="level" 
            defaultValue={level} 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm mb-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">Любой</option>
            <option value="Начальный">Начальный</option>
            <option value="Базовый">Базовый</option>
            <option value="Продвинутый">Продвинутый</option>
          </select>

          <h3 className="font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Формат</h3>
          <select 
            name="format" 
            defaultValue={format} 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm mb-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">Любой</option>
            <option value="Онлайн">Онлайн</option>
            <option value="Офлайн">Офлайн</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 mt-2 transition-colors">
            Применить
          </button>
          <Link href="/courses" className="block text-center text-xs text-slate-500 dark:text-slate-400 mt-2 hover:underline">
            Сбросить фильтры
          </Link>
        </form>

        {/* Список курсов */}
        <div>
          <form className="mb-4" method="GET">
            {/* Сохраняем текущие фильтры при поиске */}
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="level" value={level} />
            <input type="hidden" name="format" value={format} />
            <input
              name="q"
              defaultValue={q}
              placeholder="Поиск курсов по названию..."
              className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none"
            />
          </form>
          
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((c) => (
              <CourseCard
                key={c.id}
                id={c.id}
                title={c.title}
                description={c.description}
                createdAt={c.createdAt}
                imageUrl={c.imageUrl}
              />
            ))}
            {courses.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-500 dark:text-slate-400">
                По вашему запросу ничего не найдено. <Link href="/courses" className="text-blue-600 dark:text-blue-400 hover:underline">Сбросить фильтры</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}