import { prisma } from '@/lib/prisma';

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Все новости</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            {item.imageUrl ? (
              <div className="h-48 bg-slate-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-48 bg-slate-50 flex items-center justify-center text-slate-400">
                Нет фото
              </div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <div className="text-xs text-slate-400 mb-2">
                {item.createdAt.toLocaleDateString('ru-RU')}
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-3">{item.content}</p>
              
              {/* Кнопка Подробнее */}
              {item.externalUrl ? (
                <a 
                  href={item.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Подробнее
                </a>
              ) : (
                <button disabled className="block text-center bg-slate-200 text-slate-400 py-2 rounded text-sm cursor-not-allowed">
                  Подробнее
                </button>
              )}
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-slate-500 col-span-full">Новостей пока нет</p>
        )}
      </div>
    </div>
  );
}