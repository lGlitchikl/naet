'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (res?.error) {
      setError('Неверный email или пароль');
    } else {
      router.push('/profile');
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required className="w-full border rounded-md px-4 py-2" />
        <input name="password" type="password" placeholder="Пароль" required className="w-full border rounded-md px-4 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">Войти</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Нет аккаунта? <a href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</a>
      </p>
    </div>
  );
}