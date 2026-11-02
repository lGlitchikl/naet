'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function submitTest(
  testId: string,
  userId: string,
  userAnswers: Record<string, string>
) {
  let resultId = '';

  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { questions: { include: { answers: true } } },
    });

    if (!test) return { error: 'Тест не найден' };

    let score = 0;
    const answersData = [];

    for (const question of test.questions) {
      const selectedAnswerId = userAnswers[question.id];
      const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId);
      const isCorrect = selectedAnswer?.isCorrect || false;
      
      if (isCorrect) score++;

      answersData.push({
        questionId: question.id,
        answerId: selectedAnswerId,
        isCorrect,
      });
    }

    const result = await prisma.testResult.create({
      data: {
        userId,
        testId,
        score,
        total: test.questions.length,
      },
    });

    await prisma.userAnswer.createMany({
      data: answersData.map((a) => ({
        resultId: result.id,
        questionId: a.questionId,
        answerId: a.answerId,
        isCorrect: a.isCorrect,
      })),
    });

    resultId = result.id;

  } catch (err: any) {
    console.error("ОШИБКА СОХРАНЕНИЯ ТЕСТА:", err);
    return { error: 'Произошла ошибка при сохранении результатов' };
  }

  redirect(`/tests/${testId}/result/${resultId}`);
}