'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/profile', label: 'Профиль' },
    { href: '/profile/courses', label: 'Мои курсы' },
    { href: '/profile/results', label: 'Результаты тестов' },
  ];

  const adminItems = [
    { href: '/profile/admin/courses', label: 'Управление курсами' },
    { href: '/profile/admin/contests', label: 'Управление конкурсами' },
    { href: '/profile/admin/news', label: 'Управление новостями' },
  ];

  return (
    <aside className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 h-fit space-y-1 border border-slate-200 dark:border-slate-700">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-3 py-2 rounded-md text-sm transition ${
            pathname === item.href 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          {item.label}
        </Link>
      ))}

      {isAdmin && (
        <>
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Админ-панель
          </div>
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition ${
                pathname.startsWith(item.href) 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </>
      )}
    </aside>
  );
}