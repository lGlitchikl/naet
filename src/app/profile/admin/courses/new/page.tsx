import { createCourse } from '@/app/actions/admin';
import Link from 'next/link';

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Создание курса</h1>
        <Link href="/profile/admin/courses" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
          ← Назад к курсам
        </Link>
      </div>
      
      <form 
        action={createCourse} 
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm space-y-4 border border-slate-200 dark:border-slate-700 transition-colors"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Название курса</label>
          <input 
            name="title" 
            required 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Описание</label>
          <textarea 
            name="description" 
            rows={4} 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" 
          />
        </div>
        
        {/* Исправленный блок загрузки файла */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Обложка курса (картинка)</label>
          <div className="relative">
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="block w-full text-sm text-slate-500 dark:text-slate-400
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-slate-700 dark:file:text-slate-200
                dark:hover:file:bg-slate-600
                border border-slate-200 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Категория</label>
          <select 
            name="category" 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">Не выбрано</option>
            <option value="Основы компьютерной грамотности">Основы компьютерной грамотности</option>
            <option value="Финансовая грамотность">Финансовая грамотность</option>
            <option value="Кибербезопасность">Кибербезопасность</option>
            <option value="Госуслуги">Госуслуги</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Уровень</label>
          <select 
            name="level" 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">Не выбрано</option>
            <option value="Начальный">Начальный</option>
            <option value="Базовый">Базовый</option>
            <option value="Продвинутый">Продвинутый</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">Формат</label>
          <select 
            name="format" 
            className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="">Не выбрано</option>
            <option value="Онлайн">Онлайн</option>
            <option value="Офлайн">Офлайн</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}