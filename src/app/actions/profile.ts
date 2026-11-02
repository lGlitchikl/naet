'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Не авторизован');
  }

  const name = formData.get('name') as string;
  const familyname = formData.get('familyname') as string;
  const surname = formData.get('surname') as string;
  const phone = formData.get('phone') as string;
  const targetaudiencecategory = formData.get('targetaudiencecategory') as string;
  const municipalformation = formData.get('municipalformation') as string;
  const placeofwork = formData.get('placeofwork') as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      familyname,
      surname,
      phone,
      targetaudiencecategory,
      municipalformation,
      placeofwork,
    },
  });

  revalidatePath('/profile');
  redirect('/profile');
}