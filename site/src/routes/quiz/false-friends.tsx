import { createFileRoute } from "@tanstack/react-router";
import { Quiz, type QuizQuestion } from "~/components/Quiz";

export const Route = createFileRoute("/quiz/false-friends")({
  component: FalseFriendsQuiz,
});

/* ── Content ──
   Every challenge below is grounded in the reel scripts in
   /home/team/shared/reels_videos/scripts/ — words that look (or get taught)
   one way but actually mean something else. One tempting wrong answer per
   question is the common English-speaker assumption. */
const QUESTIONS: QuizQuestion[] = [
  {
    term: "embarazada",
    question: "A colleague says “Estoy embarazada.” What does she mean?",
    options: ["She's embarrassed", "She's pregnant", "She's running late"],
    correctIndex: 1,
    explanation:
      "“embarazada” means pregnant. “I'm embarrassed” is “tengo vergüenza” — a classic false friend.",
  },
  {
    term: "bizarro",
    question: "What does “bizarro” mean in Spanish?",
    options: ["Bizarre / strange", "Busy", "Brave / valiant"],
    correctIndex: 2,
    explanation:
      "“bizarro” means brave. “Strange” is “extraño” — the English word “bizarre” is the trap.",
  },
  {
    term: "macho",
    question: "In Mexico, what does “macho” mean?",
    options: ["A male (animal)", "A tough, domineering man", "A moustache"],
    correctIndex: 0,
    explanation:
      "“macho” simply means male — “Mi perro es macho.” For the attitude, say “machista”.",
  },
  {
    term: "machista",
    question: "What does “machista” describe?",
    options: ["A male animal", "The macho attitude", "A hard worker"],
    correctIndex: 1,
    explanation:
      "“Macho is a male animal. Machista is the attitude,” as the reel puts it.",
  },
  {
    term: "coger",
    question: "In Mexico, why should you avoid “coger”?",
    options: ["It's vulgar there", "It means “to cook”", "It's overly formal"],
    correctIndex: 0,
    explanation:
      "In Spain “coger” just means “to take”, but in Mexico it's vulgar — use “agarrar” instead.",
  },
  {
    term: "caliente",
    question: "How do you say “I'm hot” (temperature)?",
    options: ["Soy caliente", "Hace calor", "Tengo calor"],
    correctIndex: 2,
    explanation:
      "For temperature, say “tengo calor.” “Soy caliente” is the mistake — it doesn't mean the temperature.",
  },
  {
    term: "ahorita",
    question: "In Mexico, “ahorita” can mean…",
    options: ["Yesterday", "Exactly one hour from now", "Right now — or “eventually”"],
    correctIndex: 2,
    explanation:
      "“Ahorita lo hago” can mean now or whenever. Same language, three different clocks.",
  },
  {
    term: "vosotros",
    question: "In Spain, “vosotros” means…",
    options: ["Formal “you” (one person)", "Informal “you all”", "A farewell"],
    correctIndex: 1,
    explanation:
      "Spain says “vosotros habláis”; Mexico and most of Latin America say “ustedes hablan.” Madrid didn't get the memo to skip it.",
  },
  {
    term: "usted",
    question: "In Colombia, “usted” is…",
    options: ["Normal between friends", "Always formal", "Rude"],
    correctIndex: 0,
    explanation:
      "“¿Cómo está, parce?” — in Colombia, “usted” is completely normal between friends.",
  },
  {
    term: "vale",
    question: "In Spain, “vale” means…",
    options: ["A valley", "It costs", "Okay"],
    correctIndex: 2,
    explanation: "“Vale” means “okay” — how Madrileños agree. (A valley is “valle”.)",
  },
];

function FalseFriendsQuiz() {
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
            False Friends
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--text-secondary)]">
            Words that look familiar — but mean something else. Ten traps from our reels.
          </p>
        </div>

        <div className="mt-8">
          <Quiz
            eyebrow="False friends"
            questions={QUESTIONS}
            otherQuiz={{ label: "Try the Dialect quiz", href: "/quiz/dialect" }}
          />
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
          Want more? Try the{" "}
          <a
            href="/quiz/dialect"
            className="text-[var(--accent)] transition hover:underline"
          >
            Dialect quiz
          </a>
          .
        </p>
      </div>
    </main>
  );
}
