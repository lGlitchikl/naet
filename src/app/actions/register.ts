'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Введите имя'),
  familyname: z.string().min(1, 'Введите фамилию'),
  surname: z.string().min(1, 'Введите отчество'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(1, 'Введите телефон'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Ошибка валидации' };
  }

  const { email, password, ...rest } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Пользователь с таким email уже существует' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      ...rest,
      email,
      password: hashedPassword,
      targetaudiencecategory: 'Граждане',
      municipalformation: 'Не указано',
      placeofwork: 'Не указано',
    },
  });

  return { success: true };
}