'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Доступ запрещён');
  }
}

export async function createNews(formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const externalUrl = formData.get('externalUrl') as string;
  const imageFile = formData.get('image') as File | null;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  await prisma.news.create({
    data: { title, content, externalUrl, imageUrl }
  });

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/profile/admin/news');
  redirect('/profile/admin/news');
}

export async function deleteNews(newsId: string) {
  await checkAdmin();

  await prisma.news.delete({
    where: { id: newsId },
  });

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/profile/admin/news');
}