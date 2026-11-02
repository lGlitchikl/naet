'use client';

import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/', label: 'О портале' },
  { href: '/courses', label: 'Курсы' },
  { href: '/contests', label: 'Конкурсы' },
  { href: '/cybersecurity', label: 'Кибербезопасность' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/profile', label: 'Личный кабинет' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 h-20">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-bold text-xl group-hover:ring-2 ring-blue-200 dark:ring-blue-800 transition-all">
            <img 
              src="/images/logo.jpg" 
              alt="Логотип" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerText = 'А';
              }}
            />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white hidden lg:block">
            Цифровой гражданин НАО
          </span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                pathname === l.href
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Поиск и переключатель темы */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-[200px] hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Поиск курсов..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </form>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}