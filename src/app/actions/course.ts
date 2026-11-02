'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function enrollInCourse(courseId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: 'Необходима авторизация' };
  }

  try {
    await prisma.userCourse.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
      },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: true };
    }
    return { error: 'Не удалось записаться на курс' };
  }
}