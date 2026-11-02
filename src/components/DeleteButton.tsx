'use client';

export default function DeleteButton() {
  return (
    <button 
      type="submit" 
      className="text-red-500 hover:text-red-700 text-sm"
      onClick={(e) => {
        if (!confirm('Вы уверены, что хотите удалить курс? Все тесты и статьи будут удалены безвозвратно.')) {
          e.preventDefault();
        }
      }}
    >
      Удалить
    </button>
  );
}