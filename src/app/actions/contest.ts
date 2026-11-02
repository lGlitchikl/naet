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

export async function createContest(formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
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

  await prisma.contest.create({
    data: { title, description, externalUrl, imageUrl }
  });

  revalidatePath('/contests');
  revalidatePath('/profile/admin/contests');
  redirect('/profile/admin/contests');
}

export async function deleteContest(contestId: string) {
  await checkAdmin();

  await prisma.contest.delete({
    where: { id: contestId },
  });

  revalidatePath('/contests');
  revalidatePath('/profile/admin/contests');
}