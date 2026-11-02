'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Захарова Мария Игоревна',
    text: 'Понравилась практическая направленность курса, смог сразу применить полученные знания на практике.',
    initial: 'З',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
  },
  {
    name: 'Федоров Александр Павлович',
    text: 'Благодаря курсу стал более осторожным в интернете, узнал много полезных советов по защите данных.',
    initial: 'Ф',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  {
    name: 'Морозова Татьяна Дмитриевна',
    text: 'Курс отлично структурирован и легко усваивается, рекомендую всем, кто хочет углубить свои знания в области цифровых технологий.',
    initial: 'М',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
  },
  {
    name: 'Михайлов Иван Викторович',
    text: 'Узнал много нового о цифровых сервисах, которые помогут мне в реальной жизни.',
    initial: 'М',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
  },
];

export default function Reviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Прокручиваем на ширину одной карточки (примерно 400px)
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 dark:border-slate-800 md:col-span-2">
      {/* Заголовок и кнопки */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-800 dark:text-white">
          Отзывы
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Прокрутить влево"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Прокрутить вправо"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Контейнер с карточками */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Скрываем стандартный скролл (опционально)
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            className="min-w-[300px] md:min-w-[400px] snap-start shrink-0 border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${review.color}`}>
                {review.initial}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{review.name}</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}