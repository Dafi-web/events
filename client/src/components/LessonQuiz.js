import React, { useState, useMemo, useEffect } from 'react';
import { ClipboardCheck, RotateCcw, Trophy } from 'lucide-react';

const LessonQuiz = ({ assessment, storageKey }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = assessment?.questions || [];
  const passing = Math.min(100, Math.max(0, Number(assessment?.passingScore) || 70));
  const title = assessment?.title || 'Quick check';

  const result = useMemo(() => {
    if (!submitted || !questions.length) return null;
    let correct = 0;
    questions.forEach((q, i) => {
      const picked = answers[i];
      if (picked !== undefined && Number(picked) === Number(q.correctIndex)) {
        correct += 1;
      }
    });
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= passing;
    return { correct, total: questions.length, pct, passed };
  }, [submitted, questions, answers, passing]);

  const [bestStored, setBestStored] = useState(null);
  useEffect(() => {
    if (!storageKey) return;
    try {
      setBestStored(JSON.parse(localStorage.getItem(`quiz-best-${storageKey}`) || 'null'));
    } catch {
      setBestStored(null);
    }
  }, [storageKey, submitted]);

  if (!questions.length) return null;

  const pick = (qi, optIdx) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qi]: optIdx }));
  };

  const submit = () => {
    setSubmitted(true);
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && Number(answers[i]) === Number(q.correctIndex)) {
        correct += 1;
      }
    });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    if (storageKey) {
      try {
        const prev = JSON.parse(localStorage.getItem(`quiz-best-${storageKey}`) || '{}');
        const best = Math.max(prev.score || 0, pct);
        localStorage.setItem(
          `quiz-best-${storageKey}`,
          JSON.stringify({ score: best, at: new Date().toISOString() })
        );
      } catch {
        /* ignore */
      }
    }
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-5 h-5 text-indigo-600" />
        <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Pass when your score is at or above <strong>{passing}%</strong>. This is your lesson check — not graded by
        the server; results stay in your browser.
      </p>

      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="font-medium text-slate-900 mb-3">
              {qi + 1}. {q.question}
            </p>
            <ul className="space-y-2">
              {(q.options || []).map((opt, oi) => {
                const selected = answers[qi] === oi;
                const correct = oi === Number(q.correctIndex);
                return (
                  <li key={oi}>
                    <button
                      type="button"
                      disabled={submitted}
                      onClick={() => pick(qi, oi)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                        submitted
                          ? correct
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                            : selected
                              ? 'border-red-300 bg-red-50 text-red-900'
                              : 'border-slate-100 text-slate-500'
                          : selected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Trophy className="w-4 h-4" />
            Submit answers
          </button>
        ) : (
          <>
            <div
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                result?.passed
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              Your score: <strong>{result?.pct}%</strong> ({result?.correct}/{result?.total} correct) · Pass bar:{' '}
              <strong>{passing}%</strong> · {result?.passed ? 'Passed' : 'Try again'}
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
          </>
        )}
      </div>

      {bestStored?.score != null && (
        <p className="mt-4 text-xs text-slate-500">
          Best score saved in this browser: <strong>{bestStored.score}%</strong>
        </p>
      )}
    </section>
  );
};

export default LessonQuiz;
