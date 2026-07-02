const quizData = {
    mexican: [
        {
            question: "What does '¡Qué padre!' mean?",
            options: ["How father!", "How awful!", "How cool!", "How boring!"],
            answer: 2
        },
        {
            question: "How do you say 'swimming pool' in Mexico?",
            options: ["Piscina", "Alberca", "Pileta", "Balneario"],
            answer: 1
        },
        {
            question: "If someone says 'Ahorita', when do they usually mean?",
            options: ["Right exactly now", "Never", "In a little bit / sometime soon", "Yesterday"],
            answer: 2
        }
    ],
    cuban: [
        {
            question: "What does 'Asere' mean in Cuba?",
            options: ["Friend / buddy", "Goodbye", "Food", "Car"],
            answer: 0
        },
        {
            question: "How do you say 'papaya' in Cuba (to avoid the vulgar slang meaning)?",
            options: ["Lechosa", "Fruta bomba", "Melocotón", "Aguacate"],
            answer: 1
        },
        {
            question: "What does '¿Qué bolá?' mean?",
            options: ["What's up? / How's it going?", "What is that?", "Where are we?", "What time is it?"],
            answer: 0
        }
    ],
    rioplatense: [
        {
            question: "How do you say 'You' (informal) in Argentina/Uruguay?",
            options: ["Tú", "Usted", "Vos", "Vosotros"],
            answer: 2
        },
        {
            question: "What does 'Che' mean?",
            options: ["Hello", "Hey / friend", "Goodbye", "Thank you"],
            answer: 1
        },
        {
            question: "How do you say 'strawberry' in Argentina/Uruguay?",
            options: ["Fresa", "Frutilla", "Frambuesa", "Cereza"],
            answer: 1
        }
    ],
    chilean: [
        {
            question: "What does 'Cachai?' mean?",
            options: ["Do you understand?", "How are you?", "What's up?", "Where is it?"],
            answer: 0
        },
        {
            question: "How do you refer to a friend or 'dude' in Chile?",
            options: ["Tío", "Pata", "Weón", "Chavo"],
            answer: 2
        },
        {
            question: "What does 'Bacán' mean?",
            options: ["Boring", "Cool / awesome", "Difficult", "Easy"],
            answer: 1
        }
    ],
    colombian: [
        {
            question: "What does '¡Qué chimba!' mean in Colombia?",
            options: ["How boring!", "How cool! / Awesome!", "What a shame!", "How difficult!"],
            answer: 1
        },
        {
            question: "What is a 'Tinto' in Colombia?",
            options: ["Red wine", "Black coffee", "Tea", "Juice"],
            answer: 1
        },
        {
            question: "What does 'Parce' or 'Parcero' mean?",
            options: ["Boss", "Enemy", "Friend / buddy", "Brother"],
            answer: 2
        }
    ],
    european: [
        {
            question: "How do you say 'You all' (plural informal) in European Spanish?",
            options: ["Ustedes", "Vosotros", "Ellos", "Nosotros"],
            answer: 1
        },
        {
            question: "What does 'Coche' mean in Spain?",
            options: ["Bus", "Bicycle", "Car", "Train"],
            answer: 2
        },
        {
            question: "How do you pronounce 'Zapatos' in European Spanish?",
            options: ["/θaˈpatos/", "/saˈpatos/", "/zaˈpatos/", "/tʃaˈpatos/"],
            answer: 0
        }
    ]
};

let currentDialect = '';
let currentQuestionIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    const dialectSelect = document.getElementById('dialect-select');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizSetup = document.getElementById('quiz-setup');
    const quizArea = document.getElementById('quiz-area');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizResult = document.getElementById('quiz-result');
    const scoreDisplay = document.getElementById('score-display');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const feedbackText = document.getElementById('feedback-text');

    startQuizBtn.addEventListener('click', () => {
        currentDialect = dialectSelect.value;
        if (!currentDialect) return;
        
        currentQuestionIndex = 0;
        score = 0;
        
        quizSetup.classList.add('hidden');
        quizResult.classList.add('hidden');
        quizArea.classList.remove('hidden');
        
        loadQuestion();
    });

    function loadQuestion() {
        const questionData = quizData[currentDialect][currentQuestionIndex];
        questionText.textContent = questionData.question;
        optionsContainer.innerHTML = '';
        feedbackText.textContent = '';
        feedbackText.className = 'font-bold mt-4 text-center';
        nextQuestionBtn.classList.add('hidden');

        questionData.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition mb-3';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(index, btn);
            optionsContainer.appendChild(btn);
        });
    }

    function selectAnswer(selectedIndex, btnElement) {
        // Disable all buttons
        const allButtons = optionsContainer.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        const questionData = quizData[currentDialect][currentQuestionIndex];
        const correctIndex = questionData.answer;

        if (selectedIndex === correctIndex) {
            btnElement.classList.replace('border-gray-200', 'border-green-500');
            btnElement.classList.replace('hover:border-primary-500', 'bg-green-50');
            btnElement.classList.replace('hover:bg-primary-50', 'text-green-800');
            feedbackText.textContent = '¡Correcto!';
            feedbackText.classList.add('text-green-600');
            score++;
        } else {
            btnElement.classList.replace('border-gray-200', 'border-red-500');
            btnElement.classList.replace('hover:border-primary-500', 'bg-red-50');
            btnElement.classList.replace('hover:bg-primary-50', 'text-red-800');
            
            // Highlight correct answer
            allButtons[correctIndex].classList.replace('border-gray-200', 'border-green-500');
            allButtons[correctIndex].classList.add('bg-green-50');
            
            feedbackText.textContent = 'Incorrecto.';
            feedbackText.classList.add('text-red-600');
        }

        nextQuestionBtn.classList.remove('hidden');
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData[currentDialect].length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    function showResults() {
        quizArea.classList.add('hidden');
        quizResult.classList.remove('hidden');
        const total = quizData[currentDialect].length;
        scoreDisplay.textContent = `You scored ${score} out of ${total}!`;
        
        // Save to localStorage for dashboard
        try {
            localStorage.setItem(`fluentpath_quiz_${currentDialect}`, JSON.stringify({
                score: score,
                total: total,
                completed: true,
                date: new Date().toISOString()
            }));
        } catch (e) {}
    }

    restartQuizBtn.addEventListener('click', () => {
        quizResult.classList.add('hidden');
        quizSetup.classList.remove('hidden');
        dialectSelect.value = '';
    });
});/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
