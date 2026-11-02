'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
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

export async function createCourse(formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;
  const category = formData.get('category') as string;
  const level = formData.get('level') as string;
  const format = formData.get('format') as string;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  await prisma.course.create({ 
    data: { title, description, imageUrl, category, level, format } 
  });

  revalidatePath('/profile/admin/courses');
  revalidatePath('/courses');
  redirect('/profile/admin/courses');
}

export async function createTest(courseId: string, formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await prisma.test.create({
    data: { title, description, courseId }
  });

  revalidatePath('/profile/admin/courses');
  revalidatePath(`/profile/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);

  redirect(`/profile/admin/courses/${courseId}`);
}

export async function createArticle(courseId: string, formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
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

  await prisma.article.create({
    data: { title, content, imageUrl, courseId }
  });

  revalidatePath(`/profile/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/profile/admin/courses/${courseId}`);
}

export async function createQuestion(testId: string, courseId: string, formData: FormData) {
  await checkAdmin();
  const text = formData.get('text') as string;

  const question = await prisma.question.create({
    data: { text, testId, sortOrder: 1 }
  });

  const answers = [
    { text: formData.get('answer1') as string, isCorrect: formData.get('correct') === '1' },
    { text: formData.get('answer2') as string, isCorrect: formData.get('correct') === '2' },
    { text: formData.get('answer3') as string, isCorrect: formData.get('correct') === '3' },
    { text: formData.get('answer4') as string, isCorrect: formData.get('correct') === '4' },
  ];

  await prisma.answer.createMany({
    data: answers.map((a, i) => ({ ...a, questionId: question.id, sortOrder: i + 1 }))
  });

  revalidatePath(`/profile/admin/courses/${courseId}/tests/${testId}`);
  redirect(`/profile/admin/courses/${courseId}/tests/${testId}`);
}

export async function updateArticle(articleId: string, courseId: string, formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.article.update({
    where: { id: articleId },
    data: { title, content },
  });

  revalidatePath(`/profile/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  redirect(`/profile/admin/courses/${courseId}`);
}

export async function deleteArticle(articleId: string, courseId: string) {
  await checkAdmin();

  await prisma.article.delete({
    where: { id: articleId },
  });

  revalidatePath(`/profile/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
}

export async function deleteCourse(courseId: string) {
  await checkAdmin();

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath('/profile/admin/courses');
  revalidatePath('/courses');
  revalidatePath('/');
  redirect('/profile/admin/courses');
}