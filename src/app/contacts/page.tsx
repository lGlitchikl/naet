import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Контакты</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Контактная информация */}
        <div className="space-y-4">
          {[
            { icon: Phone, title: 'Телефон поддержки', value: '+7 (800) 101-00-11' },
            { icon: Mail, title: 'Электронная почта', value: 'support@nano-kurs.ru' },
            { icon: MapPin, title: 'Адрес', value: 'г. Нарьян-Мар, ул. Победы, д. 2' },
            { icon: Clock, title: 'Режим работы', value: 'Пн–Пт, 9:00–18:00' },
          ].map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex items-center gap-4 border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{c.title}</div>
                <div className="font-medium text-slate-900 dark:text-white">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Форма обратной связи */}
        <form className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4 border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Напишите нам</h2>
          <input placeholder="Ваше имя" className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-md px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400" />
          <input placeholder="Email" type="email" className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-md px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400" />
          <input placeholder="Телефон" className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-md px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400" />
          <textarea placeholder="Сообщение" rows={4} className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-md px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400" />
          <button type="button" className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition">
            Отправить
          </button>
        </form>
      </div>

      {/* Карта */}
      <div className="mt-8 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 h-80">
        <img 
          src="/images/karta.png" 
          alt="Карта проезда" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}