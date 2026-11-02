import { ShieldAlert, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CybersecurityPage() {
  const materials = [
    { id: 1, title: 'Что такое двухфакторная аутентификация (2FA) и зачем она нужна', image: '/images/cybersecurity/kib1.jpg', link: '/materials/1' },
    { id: 2, title: 'Что такое атака Man-in-the-Middle или человек посередине', image: '/images/cybersecurity/kib2.jpg', link: '/materials/2' },
    { id: 3, title: 'Что такое дедик: ликбез по выделенным серверам', image: '/images/cybersecurity/kib3.jpg', link: '/materials/3' },
    { id: 4, title: 'Как защитить сервер от DDoS: пошаговый чек-лист', image: '/images/cybersecurity/kib4.jpg', link: '/materials/4' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Верхний баннер */}
      <div className="bg-rose-50 dark:bg-slate-800 rounded-2xl p-8 mb-8 flex items-center gap-6 border border-rose-100 dark:border-slate-700 transition-colors">
        <ShieldAlert className="w-16 h-16 text-rose-600 dark:text-rose-400 shrink-0" />
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Кибербезопасность и защита от мошенников</h1>
          <p className="text-slate-600 dark:text-slate-300">Узнайте, как распознавать угрозы в интернете и защитить свои данные. Простой и понятный гид по цифровой безопасности.</p>
        </div>
        <Lock className="w-24 h-24 text-blue-300 dark:text-blue-700 shrink-0 hidden md:block" />
      </div>

      {/* Правила */}
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Правила поведения в интернете</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {['Не переходите по подозрительным ссылкам', 'Используйте надёжные пароли', 'Не сообщайте коды из СМС', 'Проверяйте сайты перед оплатой'].map((t, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-3">
              {i + 1}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{t}</p>
          </div>
        ))}
      </div>

      {/* Полезные материалы */}
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Полезные материалы</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.map((item) => (
          <Link 
            key={item.id} 
            href={item.link} 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition group block"
          >
            <div className="h-32 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}