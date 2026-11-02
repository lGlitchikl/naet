import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';
import { BookOpen, MapPin, Users, Award } from 'lucide-react';
import Reviews from '@/components/Reviews';

export default async function Home() {
  const courses = await prisma.course.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const latestNews = await prisma.news.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const stats = [
    { icon: BookOpen, label: 'Курсы', value: courses.length || 11 },
    { icon: MapPin, label: 'Муниципальные образования', value: 22 },
    { icon: Users, label: 'Человек обучилось', value: '1000+' },
    { icon: Award, label: 'Курсов', value: 691 },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Цифровой гражданин НАО</h1>
        </div>
      </section>

      {/* Статистика */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 flex items-center gap-3 border border-slate-100 dark:border-slate-700 transition-colors">
              <s.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Популярные курсы */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Популярные курсы</h2>
          <Link href="/courses" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Все курсы →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-slate-500 dark:text-slate-400 col-span-4">Курсы пока не добавлены</p>
          )}
        </div>
      </section>

      {/* Новости и Отзывы */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">

        {/* Блок Новостей */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Новости</h2>
            <Link href="/news" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Все новости →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestNews.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col hover:shadow-md transition">
                {item.imageUrl && (
                  <div className="h-40 bg-slate-100 dark:bg-slate-700">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                    {item.createdAt.toLocaleDateString('ru-RU')}
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{item.content}</p>

                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-xs font-medium"
                    >
                      Подробнее
                    </a>
                  ) : (
                    <button disabled className="block text-center bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 py-2 rounded text-xs cursor-not-allowed">
                      Ссылка скоро появится
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {latestNews.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">Новостей пока нет</p>
          )}
        </div>

        {/* Секция Отзывы */}
        <Reviews />
      </section>
    </>
  );
}