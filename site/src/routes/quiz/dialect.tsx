import { createFileRoute } from "@tanstack/react-router";
import { Quiz, type QuizQuestion } from "~/components/Quiz";

export const Route = createFileRoute("/quiz/dialect")({
  component: DialectQuiz,
});

/* ── Content ──
   Every term below is pulled verbatim from the reel scripts in
   /home/team/shared/reels_videos/scripts/ — one word or phrase per reel, with
   the country it belongs to. Each has three plausible Spanish-speaking options. */
const QUESTIONS: QuizQuestion[] = [
  {
    term: "guay",
    question: "Where would you hear this for “cool”?",
    options: ["Mexico", "Spain", "Argentina"],
    correctIndex: 1,
    explanation:
      "“guay” is Spain's word for cool — “Eso es muy guay.” Mexico says “chido”, Argentina “copado”.",
  },
  {
    term: "chido",
    question: "Which country's Spanish is this?",
    options: ["Mexico", "Spain", "Colombia"],
    correctIndex: 0,
    explanation:
      "“chido” is Mexican — “Está bien chido.” Spain says “guay”, Argentina “copado”.",
  },
  {
    term: "guita",
    question: "Where is “guita” money?",
    options: ["Chile", "Spain", "Argentina"],
    correctIndex: 2,
    explanation:
      "“¿Tenés guita?” is Argentinian. Spain says “pasta”, Mexico “lana”.",
  },
  {
    term: "¿Cachai?",
    question: "Where would you hear “¿Cachai?” for “do you follow?”",
    options: ["Chile", "Mexico", "Colombia"],
    correctIndex: 0,
    explanation:
      "“¿Cachai?” is Chilean for “do you follow?” — one reason Chilean Spanish is famously hard to follow.",
  },
  {
    term: "ahorita",
    question: "Which country made “ahorita” famous?",
    options: ["Argentina", "Mexico", "Spain"],
    correctIndex: 1,
    explanation:
      "“Ahorita lo hago” is Mexican — and its timing can mean “now” or “eventually”.",
  },
  {
    term: "pasta",
    question: "Where does “pasta” mean money?",
    options: ["Spain", "Argentina", "Mexico"],
    correctIndex: 0,
    explanation: "“No tengo pasta” is Spain's way to say “I'm broke.”",
  },
  {
    term: "¿Qué más?",
    question: "Where does “¿Qué más?” mean “what's up?”",
    options: ["Chile", "Colombia", "Argentina"],
    correctIndex: 1,
    explanation: "“¿Qué más?” is Colombian — “¿Qué más, bien o qué?”",
  },
  {
    term: "Sí poh",
    question: "Where would you hear “Sí poh”?",
    options: ["Chile", "Spain", "Mexico"],
    correctIndex: 0,
    explanation: "“Sí poh” is Chilean — Chileans swallow the ends of words.",
  },
  {
    term: "lana",
    question: "Where is “lana” money?",
    options: ["Colombia", "Argentina", "Mexico"],
    correctIndex: 2,
    explanation: "“No traigo lana” is Mexican for “I've got no cash.”",
  },
  {
    term: "al toque",
    question: "Where does “al toque” mean “right away”?",
    options: ["Spain", "Chile", "Argentina"],
    correctIndex: 2,
    explanation: "“Lo hago al toque” is Argentinian for “I'll do it right away.”",
  },
];

function DialectQuiz() {
  return (
    <main
      className="min-h-dvh px-4 py-10 sm:px-6"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <div className="mx-auto max-w-xl">
        <a
          href="/"
          className="text-sm text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
        >
          ← Back to FluentPath Spanish
        </a>

        <div className="mt-6 text-center">
          <h1 className="font-['Montserrat'] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            Which dialect is it?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--text-secondary)]">
            Ten words and phrases straight from our reels. Can you place each one?
          </p>
        </div>

        <div className="mt-8">
          <Quiz
            eyebrow="Dialect quiz"
            questions={QUESTIONS}
            otherQuiz={{ label: "Try the False Friends quiz", href: "/quiz/false-friends" }}
          />
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
          Want more? Try the{" "}
          <a
            href="/quiz/false-friends"
            className="text-[var(--accent)] transition hover:underline"
          >
            False Friends quiz
          </a>
          .
        </p>
      </div>
    </main>
  );
}
