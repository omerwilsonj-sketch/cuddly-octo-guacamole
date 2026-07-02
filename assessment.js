// Level Assessment / Placement Quiz
// Tests general Spanish proficiency across beginner, intermediate, and advanced levels

const assessmentQuestions = [
    // === BEGINNER (Questions 1-5) ===
    {
        level: 'beginner',
        question: 'How do you say "Good morning" in Spanish?',
        options: ['Buenas tardes', 'Buenos días', 'Buenas noches', 'Hola'],
        answer: 1
    },
    {
        level: 'beginner',
        question: 'What is the correct way to say "I am" in Spanish?',
        options: ['Tú eres', 'Él es', 'Yo soy', 'Nosotros somos'],
        answer: 2
    },
    {
        level: 'beginner',
        question: 'Which number is "quince"?',
        options: ['5', '10', '15', '20'],
        answer: 2
    },
    {
        level: 'beginner',
        question: 'What does "gracias" mean?',
        options: ['Please', 'Sorry', 'Hello', 'Thank you'],
        answer: 3
    },
    {
        level: 'beginner',
        question: 'How do you ask "Where is the bathroom?" in Spanish?',
        options: ['¿Cómo estás?', '¿Dónde está el baño?', '¿Qué hora es?', '¿Cuánto cuesta?'],
        answer: 1
    },
    // === INTERMEDIATE (Questions 6-10) ===
    {
        level: 'intermediate',
        question: 'Which sentence correctly uses the subjunctive?',
        options: ['Quiero que él viene', 'Quiero que él venga', 'Quiero que él venió', 'Quiero que él vendrá'],
        answer: 1
    },
    {
        level: 'intermediate',
        question: 'What does "Si hubiera sabido, no lo habría hecho" mean?',
        options: ['If I knew, I would do it', 'If I had known, I would not have done it', 'If I know, I will do it', 'If I knew, I did it'],
        answer: 1
    },
    {
        level: 'intermediate',
        question: 'Which is the correct preterite form of "ella / hablar"?',
        options: ['Ella hablaba', 'Ella habló', 'Ella ha hablado', 'Ella hablaría'],
        answer: 1
    },
    {
        level: 'intermediate',
        question: 'What does "ponerse" mean in the context of emotions?',
        options: ['To put on clothing', 'To become (sudden emotion)', 'To stop', 'To arrive'],
        answer: 1
    },
    {
        level: 'intermediate',
        question: 'Which sentence is grammatically correct?',
        options: ['Le gusta nadar', 'Le gusta nadando', 'Le gusta nadado', 'Le gusta nadaré'],
        answer: 0
    },
    // === ADVANCED (Questions 11-15) ===
    {
        level: 'advanced',
        question: 'What is the correct translation of "Had I known, I would have come earlier"?',
        options: ['Si sabía, habría venido más temprano', 'De haber sabido, habría venido más temprano', 'Si sé, vengo más temprano', 'Si sabré, vendré más temprano'],
        answer: 1
    },
    {
        level: 'advanced',
        question: 'Which of these uses "se" as an accidental/unintentional structure?',
        options: ['Se levantó temprano', 'Se me cayó el vaso', 'Se llama María', 'Se vendió la casa'],
        answer: 1
    },
    {
        level: 'advanced',
        question: 'What does "Ojalá" require grammatically?',
        options: ['Indicative', 'Infinitive', 'Subjunctive', 'Conditional'],
        answer: 2
    },
    {
        level: 'advanced',
        question: 'Which phrase expresses "I look forward to hearing from you" in formal correspondence?',
        options: ['Espero oír de ti pronto', 'Quedo a la espera de su respuesta', 'Te espero oír', 'Quiero escucharte pronto'],
        answer: 1
    },
    {
        level: 'advanced',
        question: 'What does "No es para tanto" mean?',
        options: ['It is not for both', 'It is not a big deal', 'It is not enough', 'It is too much'],
        answer: 1
    }
];

const assessmentState = {
    currentQuestion: 0,
    score: 0,
    levelScores: { beginner: 0, intermediate: 0, advanced: 0 },
    totalByLevel: { beginner: 5, intermediate: 5, advanced: 5 },
    answers: [],
    completed: false
};

document.addEventListener('DOMContentLoaded', () => {
    const assessSetup = document.getElementById('assess-setup');
    const assessArea = document.getElementById('assess-area');
    const assessResult = document.getElementById('assess-result');
    const startAssessBtn = document.getElementById('start-assess-btn');
    const assessQuestion = document.getElementById('assess-question');
    const assessOptions = document.getElementById('assess-options');
    const assessProgress = document.getElementById('assess-progress');
    const assessLevelTag = document.getElementById('assess-level-tag');
    const assessFeedback = document.getElementById('assess-feedback');
    const assessNextBtn = document.getElementById('assess-next-btn');
    const assessYourLevel = document.getElementById('assess-your-level');
    const assessScoreDetail = document.getElementById('assess-score-detail');
    const assessRecommendation = document.getElementById('assess-recommendation');
    const restartAssessBtn = document.getElementById('restart-assess-btn');

    if (!startAssessBtn) return;

    // Load saved progress from localStorage
    loadProgress();

    startAssessBtn.addEventListener('click', () => {
        resetAssessment();
        assessSetup.classList.add('hidden');
        assessResult.classList.add('hidden');
        assessArea.classList.remove('hidden');
        showAssessmentQuestion();
    });

    assessNextBtn.addEventListener('click', () => {
        assessmentState.currentQuestion++;
        if (assessmentState.currentQuestion < assessmentQuestions.length) {
            showAssessmentQuestion();
        } else {
            showAssessmentResult();
        }
    });

    restartAssessBtn.addEventListener('click', () => {
        resetAssessment();
        assessResult.classList.add('hidden');
        assessSetup.classList.remove('hidden');
    });

    function showAssessmentQuestion() {
        const q = assessmentQuestions[assessmentState.currentQuestion];
        assessQuestion.textContent = q.question;
        assessProgress.textContent = `Question ${assessmentState.currentQuestion + 1} of ${assessmentQuestions.length}`;
        assessLevelTag.textContent = q.level.charAt(0).toUpperCase() + q.level.slice(1);
        assessLevelTag.className = `text-xs font-bold px-3 py-1 rounded-full ${
            q.level === 'beginner' ? 'bg-green-100 text-green-800' :
            q.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
        }`;
        assessFeedback.classList.add('hidden');
        assessNextBtn.classList.add('hidden');

        assessOptions.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition mb-3';
            btn.textContent = option;
            btn.onclick = () => selectAssessmentAnswer(index, btn);
            assessOptions.appendChild(btn);
        });
    }

    function selectAssessmentAnswer(selectedIndex, btnElement) {
        const q = assessmentQuestions[assessmentState.currentQuestion];
        const allButtons = assessOptions.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === q.answer;
        if (isCorrect) {
            btnElement.classList.replace('border-gray-200', 'border-green-500');
            btnElement.classList.add('bg-green-50');
            assessmentState.score++;
            assessmentState.levelScores[q.level]++;
            assessFeedback.textContent = '✓ Correct!';
            assessFeedback.className = 'font-bold mt-4 text-center text-green-600';
        } else {
            btnElement.classList.replace('border-gray-200', 'border-red-500');
            btnElement.classList.add('bg-red-50');
            allButtons[q.answer].classList.replace('border-gray-200', 'border-green-500');
            allButtons[q.answer].classList.add('bg-green-50');
            assessFeedback.textContent = `✗ Incorrect. The correct answer was: "${q.options[q.answer]}"`;
            assessFeedback.className = 'font-bold mt-4 text-center text-red-600';
        }

        assessmentState.answers.push({
            questionIndex: assessmentState.currentQuestion,
            selected: selectedIndex,
            correct: isCorrect
        });

        assessFeedback.classList.remove('hidden');
        assessNextBtn.classList.remove('hidden');
        saveProgress();
    }

    function showAssessmentResult() {
        assessArea.classList.add('hidden');
        assessResult.classList.remove('hidden');

        const total = assessmentQuestions.length;
        const beginnerPct = assessmentState.levelScores.beginner / assessmentState.totalByLevel.beginner;
        const intermediatePct = assessmentState.levelScores.intermediate / assessmentState.totalByLevel.intermediate;
        const advancedPct = assessmentState.levelScores.advanced / assessmentState.totalByLevel.advanced;

        let overallLevel;
        let recommendation;

        if (beginnerPct < 0.6 && intermediatePct < 0.4) {
            overallLevel = 'Beginner';
            recommendation = 'We recommend our Group Classes (£20-£35/session) to build a strong foundation in a supportive environment.';
        } else if (intermediatePct >= 0.6 && advancedPct < 0.6) {
            overallLevel = 'Intermediate';
            recommendation = 'You\'re ready for 1-on-1 Coaching (£40-£80/hr) to target your specific weak areas and accelerate your fluency.';
        } else {
            // Check if high intermediate or advanced
            if (advancedPct >= 0.6) {
                overallLevel = 'Advanced';
                recommendation = 'Our Subscription plan (£19/month) with unlimited sessions is perfect for maintaining and refining your advanced skills across multiple dialects.';
            } else {
                overallLevel = 'Intermediate';
                recommendation = 'Our Subscription plan (£19/month) gives you unlimited weekly sessions to push through to advanced fluency efficiently.';
            }
        }

        assessYourLevel.textContent = `${overallLevel} (${assessmentState.score}/${total} correct)`;
        assessScoreDetail.textContent = `Beginner: ${assessmentState.levelScores.beginner}/5 | Intermediate: ${assessmentState.levelScores.intermediate}/5 | Advanced: ${assessmentState.levelScores.advanced}/5`;

        if (overallLevel === 'Beginner') {
            assessRecommendation.innerHTML = `<div class="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
                <p class="text-primary-800 font-bold mb-2">📘 Recommended: Group Classes</p>
                <p class="text-gray-700">${recommendation}</p>
                <a href="#pricing" class="inline-block mt-3 bg-primary-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-600 transition">View Pricing</a>
            </div>`;
        } else if (overallLevel === 'Intermediate') {
            assessRecommendation.innerHTML = `<div class="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
                <p class="text-primary-800 font-bold mb-2">📗 Recommended: 1-on-1 Coaching or Subscription</p>
                <p class="text-gray-700">${recommendation}</p>
                <a href="#pricing" class="inline-block mt-3 bg-primary-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-600 transition">View Pricing</a>
            </div>`;
        } else {
            assessRecommendation.innerHTML = `<div class="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
                <p class="text-primary-800 font-bold mb-2">📕 Recommended: Subscription Plan</p>
                <p class="text-gray-700">${recommendation}</p>
                <a href="#pricing" class="inline-block mt-3 bg-primary-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-600 transition">View Pricing</a>
            </div>`;
        }

        assessmentState.completed = true;
        saveProgress();
    }

    function resetAssessment() {
        assessmentState.currentQuestion = 0;
        assessmentState.score = 0;
        assessmentState.levelScores = { beginner: 0, intermediate: 0, advanced: 0 };
        assessmentState.answers = [];
        assessmentState.completed = false;
        saveProgress();
    }

    function saveProgress() {
        try {
            localStorage.setItem('fluentpath_assessment', JSON.stringify(assessmentState));
        } catch (e) {}
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem('fluentpath_assessment');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.completed) {
                    // Show a "You've already taken the assessment" notice
                    const notice = document.getElementById('assess-completed-notice');
                    if (notice) notice.classList.remove('hidden');
                }
            }
        } catch (e) {}
    }
});