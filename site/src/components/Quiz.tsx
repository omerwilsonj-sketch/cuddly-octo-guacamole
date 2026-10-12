import { useState } from "react";

/* ── Shared interactive quiz component ──
   Renders a single-question-at-a-time, fully client-side quiz that matches the
   site's design system (CSS variables for dark/light tokens, .card/.btn classes,
   mobile-first). Used by both /quiz/dialect and /quiz/false-friends. */

export interface QuizQuestion {
  /** The Spanish term or phrase highlighted in the question card. */
  term: string;
  /** The prompt shown beneath the term. */
  question: string;
  /** Exactly three answer choices (kept to three for a clean mobile layout). */
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  /** Honest, one-line explanation shown after the answer is revealed. */
  explanation: string;
}

export interface QuizLink {
  label: string;
  href: string;
}

function resultMessage(pct: number): string {
  if (pct === 100) return "Perfect — every one right.";
  if (pct >= 80) return "Excellent. You know your stuff.";
  if (pct >= 50) return "Solid — you're catching the patterns.";
  return "Tricky, right? That's exactly why these quizzes exist.";
}

/* ── Final results screen ── */
function Results({
  score,
  total,
  onRestart,
  otherQuiz,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  otherQuiz: QuizLink;
}) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="card text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        Results
      </p>
      <p className="mt-4 font-['Montserrat'] text-5xl font-bold text-[var(--text-primary)]">
        {score}
        <span className="text-2xl text-[var(--text-tertiary)]"> / {total}</span>
      </p>
      <p className="mt-3 text-[var(--text-secondary)]">{resultMessage(pct)}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onRestart} className="btn-secondary flex-1">
          Try again
        </button>
        <a href={otherQuiz.href} className="btn-primary flex-1">
          {otherQuiz.label}
        </a>
      </div>
    </div>
  );
}

export function Quiz({
  eyebrow,
  questions,
  otherQuiz,
}: {
  eyebrow: string;
  questions: QuizQuestion[];
  otherQuiz: QuizLink;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[index];
  const answered = selected !== null;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <Results
        score={score}
        total={total}
        onRestart={handleRestart}
        otherQuiz={otherQuiz}
      />
    );
  }

  return (
    <div>
      {/* ── Progress ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>Score {score}</span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-layer-2)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + (answered ? 1 : 0)}
          aria-label="Quiz progress"
        >
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Question card ── */}
      <div className="card">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-['Montserrat'] text-3xl font-bold text-[var(--text-primary)]">
          {q.term}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">{q.question}</p>

        <div className="mt-6 space-y-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            let cls =
              "border-[var(--border-strong)] bg-[var(--bg-layer-2)] hover:border-[var(--accent)]";
            if (answered) {
              if (isCorrect) cls = "border-[var(--success)] bg-[var(--success-bg)]";
              else if (isSelected) cls = "border-[var(--error)] bg-[var(--error-bg)]";
              else cls = "border-[var(--border-subtle)] bg-[var(--bg-layer-2)] opacity-50";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={answered}
                aria-pressed={answered ? isSelected : false}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-[var(--text-primary)] transition ${cls} ${
                  answered ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
                    answered && isCorrect
                      ? "border-[var(--success)] text-[var(--success)]"
                      : answered && isSelected
                        ? "border-[var(--error)] text-[var(--error)]"
                        : "border-[var(--border-strong)] text-[var(--text-tertiary)]"
                  }`}
                >
                  {answered && isCorrect ? "✓" : answered && isSelected ? "✗" : String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* ── Explanation (revealed after answering) ── */}
        {answered && (
          <div
            className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-layer-1)] px-4 py-3"
            role="status"
          >
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <span
                className={`font-semibold ${
                  selected === q.correctIndex
                    ? "text-[var(--success)]"
                    : "text-[var(--error)]"
                }`}
              >
                {selected === q.correctIndex ? "Correct." : "Not quite."}{" "}
              </span>
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {answered && (
        <button type="button" onClick={handleNext} className="btn-primary mt-6 w-full">
          {index < total - 1 ? "Next question" : "See results"}
        </button>
      )}
    </div>
  );
}
