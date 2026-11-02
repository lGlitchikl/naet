import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import TestForm from './TestForm';

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      questions: {
        include: { answers: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!test) notFound();

  if (test.questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{test.title}</h1>
        <p className="text-slate-500 dark:text-slate-400">В этом тесте пока нет вопросов.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{test.title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{test.description}</p>
      </div>

      <TestForm test={test} userId={session.user.id} />
    </div>
  );
}