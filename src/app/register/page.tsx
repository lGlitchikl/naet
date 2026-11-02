'use client';
import { registerUser } from '@/app/actions/register';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/login');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Имя" required className="w-full border rounded-md px-4 py-2" />
        <input name="familyname" placeholder="Фамилия" required className="w-full border rounded-md px-4 py-2" />
        <input name="surname" placeholder="Отчество" required className="w-full border rounded-md px-4 py-2" />
        <input name="email" type="email" placeholder="Email" required className="w-full border rounded-md px-4 py-2" />
        <input name="phone" placeholder="Телефон" required className="w-full border rounded-md px-4 py-2" />
        <input name="password" type="password" placeholder="Пароль (мин. 6 символов)" required className="w-full border rounded-md px-4 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">Зарегистрироваться</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Уже есть аккаунт? <a href="/login" className="text-blue-600 hover:underline">Войти</a>
      </p>
    </div>
  );
}