'use client';

import { useState } from 'react';
import { submitTest } from '@/app/actions/test';

type Answer = { id: string; text: string };
type Question = { id: string; text: string; answers: Answer[] };
type Test = { id: string; title: string; questions: Question[] };

export default function TestForm({ test, userId }: { test: Test; userId: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (Object.keys(answers).length < test.questions.length) {
      setError('Пожалуйста, ответьте на все вопросы перед отправкой.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await submitTest(test.id, userId, answers);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {test.questions.map((q, index) => (
        <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
            {index + 1}. {q.text}
          </h3>
          <div className="space-y-2">
            {q.answers.map((a) => (
              <label
                key={a.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  answers[q.id] === a.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={a.id}
                  checked={answers[q.id] === a.id}
                  onChange={() => handleSelect(q.id, a.id)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">{a.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Проверка...' : 'Завершить тест'}
      </button>
    </form>
  );
}