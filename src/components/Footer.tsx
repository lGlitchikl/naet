export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 py-10 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white font-semibold mb-2">Цифровой гражданин НАО</h4>
          <p className="text-sm">Портал обучения цифровой грамотности</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Навигация</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/courses" className="hover:text-white">Курсы</a></li>
            <li><a href="/contests" className="hover:text-white">Конкурсы</a></li>
            <li><a href="/contacts" className="hover:text-white">Контакты</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Контакты</h4>
          <p className="text-sm">+7 (800) 101-00-11</p>
          <p className="text-sm">support@nano-kurs.ru</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 mt-8">
        © 2026 Все права защищены.
      </div>
    </footer>
  );
}