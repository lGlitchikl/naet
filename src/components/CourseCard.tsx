import Link from 'next/link';

type Props = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  imageUrl?: string | null;
};

export default function CourseCard({ id, title, description, createdAt, imageUrl }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="h-40 relative bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-semibold text-lg text-center px-4">{title}</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 flex-1">
          {description || 'Описание курса'}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Создан: {createdAt.toLocaleDateString('ru-RU')}
          </span>
          <Link
            href={`/courses/${id}`}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}