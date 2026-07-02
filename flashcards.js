// Flashcards data: dialect-specific vocabulary decks
const flashcardDecks = {
    mexican: [
        {
            word: "Chido",
            definition: "Cool / Awesome",
            example: "Esa camiseta está muy chida."
        },
        {
            word: "Güey (Wey)",
            definition: "Dude / Buddy (very common informal address)",
            example: "¿Qué onda, güey? — What's up, dude?"
        },
        {
            word: "Neta",
            definition: "Truth / Really? / For real?",
            example: "¿Neta? ¡No manches! — Really? No way!"
        },
        {
            word: "Chamarra",
            definition: "Jacket",
            example: "Me compré una chamarra nueva para el invierno."
        },
        {
            word: "Refresco",
            definition: "Soda / Soft drink",
            example: "¿Me das un refresco, por favor?"
        },
        {
            word: "Platicar",
            definition: "To chat / To talk",
            example: "Ayer estuve platicando con mi amigo."
        },
        {
            word: "Ahorita",
            definition: "In a little bit / Right now (flexible timing)",
            example: "Ahorita voy — I'll be there in a bit."
        },
        {
            word: "¡No manches!",
            definition: "No way! / You're kidding! (expression of disbelief)",
            example: "¡No manches! ¿En serio ganaste la lotería?"
        }
    ],
    cuban: [
        {
            word: "Asere (Acere)",
            definition: "Friend / Buddy",
            example: "¿Qué bola, asere? — What's up, buddy?"
        },
        {
            word: "Qué bola",
            definition: "What's up? / What's happening? (greeting)",
            example: "¡Ey, qué bola! ¿Cómo andas?"
        },
        {
            word: "Yuma",
            definition: "Foreigner (especially American/European)",
            example: "En la playa había muchos yumas."
        },
        {
            word: "Fruta bomba",
            definition: "Papaya (avoid the vulgar slang 'papaya')",
            example: "Voy a comprar fruta bomba para el desayuno."
        },
        {
            word: "Chévere",
            definition: "Cool / Great",
            example: "La fiesta estuvo muy chévere."
        },
        {
            word: "Jama",
            definition: "Food / To eat",
            example: "Vamos a jama, tengo hambre."
        },
        {
            word: "Pinga",
            definition: "Nothing / At all (used in 'no hay pinga' — there's nothing)",
            example: "No hay pinga en la nevera. — There's nothing in the fridge."
        }
    ],
    rioplatense: [
        {
            word: "Che",
            definition: "Hey / Man / Buddy (attention-getter or address)",
            example: "Che, ¿me pasás la sal? — Hey, pass me the salt?"
        },
        {
            word: "Vos",
            definition: "You (informal singular, replaces 'tú')",
            example: "Vos sabés que te quiero. — You know I love you."
        },
        {
            word: "Boludo",
            definition: "Dude / Buddy (affectionate; can be insulting depending on tone)",
            example: "Che boludo, ¿vamos al partido?"
        },
        {
            word: "Frutilla",
            definition: "Strawberry",
            example: "Quiero un helado de frutilla."
        },
        {
            word: "Bondi",
            definition: "Bus (public transportation)",
            example: "Tomá el bondi 152 hasta Palermo."
        },
        {
            word: "Laburar",
            definition: "To work",
            example: "Estoy laburando en una empresa nueva."
        },
        {
            word: "Pibe / Piba",
            definition: "Guy / Girl / Kid",
            example: "Ese pibe es muy simpático."
        },
        {
            word: "¡Qué macana!",
            definition: "What a shame! / What a hassle!",
            example: "Perdí el vuelo. ¡Qué macana!"
        }
    ],
    chilean: [
        {
            word: "Weón / Weona",
            definition: "Dude / Mate (extremely common, mild like 'mate')",
            example: "Oye weón, ¿cómo estai? — Hey dude, how are you?"
        },
        {
            word: "Cachai",
            definition: "You know? / Get it? (from 'cachar' — to understand)",
            example: "Es bien fácil, ¿cachai?"
        },
        {
            word: "Pololo / Polola",
            definition: "Boyfriend / Girlfriend",
            example: "Mi pololo me invitó al cine esta noche."
        },
        {
            word: "Bacán",
            definition: "Cool / Awesome",
            example: "La película estuvo bacán."
        },
        {
            word: "Carrete",
            definition: "Party / Going out",
            example: "¿Vamos a un carrete este sábado?"
        },
        {
            word: "Pegar el palo",
            definition: "To leave / To take off",
            example: "Ya es tarde, voy a pegar el palo."
        },
        {
            word: "Al tiro",
            definition: "Immediately / Right away",
            example: "Voy al tiro. — I'll go right now."
        }
    ],
    colombian: [
        {
            word: "Parce / Parcero",
            definition: "Friend / Buddy (very common in Medellín)",
            example: "¿Qué más, parce? — What's up, buddy?"
        },
        {
            word: "¡Qué chimba!",
            definition: "How cool! / Awesome! (slang, can be vulgar in other contexts)",
            example: "¡Qué chimba de concierto! — What an awesome concert!"
        },
        {
            word: "Tinto",
            definition: "Black coffee",
            example: "Un tinto bien cargado, por favor."
        },
        {
            word: "Berraquera",
            definition: "Determination / Guts / Coolness",
            example: "Ese man es una berraquera. — That guy is amazing."
        },
        {
            word: "Listo",
            definition: "Okay / Ready / Done (used constantly)",
            example: "—¿Vamos a las 8? —Listo. —We'll go at 8? —Okay."
        },
        {
            word: "Avispar",
            definition: "To be alert / To get smart",
            example: "Hay que avisparse con los precios."
        },
        {
            word: "Vaina",
            definition: "Thing / Stuff",
            example: "¿Qué vaina es esa? — What thing is that?"
        },
        {
            word: "Mamera",
            definition: "A hassle / Boring (slang)",
            example: "Qué mamera tener que madrugar. — What a drag having to wake up early."
        }
    ],
    european: [
        {
            word: "Coche",
            definition: "Car",
            example: "Me compré un coche nuevo."
        },
        {
            word: "Vosotros",
            definition: "You (plural informal, used in Spain only)",
            example: "Vosotros sois muy simpáticos."
        },
        {
            word: "Vale",
            definition: "Okay / Alright (used constantly in Spain)",
            example: "—¿Quedamos a las 8? —Vale. —Meet at 8? —Okay."
        },
        {
            word: "Coger",
            definition: "To take / To catch (neutral in Spain, vulgar in LATAM)",
            example: "Voy a coger el autobús."
        },
        {
            word: "Piso",
            definition: "Apartment / Flat",
            example: "Vivo en un piso en el centro de Madrid."
        },
        {
            word: "Guay",
            definition: "Cool / Great (slang)",
            example: "Esa película es muy guay."
        },
        {
            word: "Tener prisa",
            definition: "To be in a hurry",
            example: "Lo siento, tengo prisa. — Sorry, I'm in a hurry."
        },
        {
            word: "Zumo",
            definition: "Juice (not 'jugo' as in LATAM)",
            example: "Quiero un zumo de naranja, por favor."
        }
    ]
};

// State
let currentDeck = [];
let currentCardIndex = 0;
let isFlipped = false;

// DOM references (set on DOMContentLoaded)
let flashDialectSelect;
let startFlashcardsBtn;
let flashSetup;
let flashArea;
let flashResult;
let flashCardInner;
let flashWord;
let flashDefinition;
let flashExample;
let flashCounter;
let prevCardBtn;
let nextCardBtn;
let shuffleBtn;
let restartFlashBtn;

document.addEventListener('DOMContentLoaded', () => {
    flashDialectSelect = document.getElementById('flash-dialect-select');
    startFlashcardsBtn = document.getElementById('start-flashcards-btn');
    flashSetup = document.getElementById('flash-setup');
    flashArea = document.getElementById('flash-area');
    flashResult = document.getElementById('flash-result');
    flashCardInner = document.getElementById('flash-card-inner');
    flashWord = document.getElementById('flash-word');
    flashDefinition = document.getElementById('flash-definition');
    flashExample = document.getElementById('flash-example');
    flashCounter = document.getElementById('flash-counter');
    prevCardBtn = document.getElementById('prev-card-btn');
    nextCardBtn = document.getElementById('next-card-btn');
    shuffleBtn = document.getElementById('shuffle-btn');
    restartFlashBtn = document.getElementById('restart-flash-btn');

    if (!startFlashcardsBtn) return; // Not on a page with flashcards

    startFlashcardsBtn.addEventListener('click', startFlashcards);
    prevCardBtn.addEventListener('click', prevCard);
    nextCardBtn.addEventListener('click', nextCard);
    shuffleBtn.addEventListener('click', shuffleDeck);
    restartFlashBtn.addEventListener('click', restartFlashcards);

    // Click on card to flip
    flashCardInner.addEventListener('click', flipCard);
});

function startFlashcards() {
    const dialect = flashDialectSelect.value;
    if (!dialect) return;

    currentDeck = [...flashcardDecks[dialect]];
    currentCardIndex = 0;
    isFlipped = false;

    flashSetup.classList.add('hidden');
    flashResult.classList.add('hidden');
    flashArea.classList.remove('hidden');

    showCard();
}

function showCard() {
    if (currentDeck.length === 0) return;

    const card = currentDeck[currentCardIndex];
    flashWord.textContent = card.word;
    flashDefinition.textContent = card.definition;
    flashExample.textContent = card.example;
    flashCounter.textContent = `${currentCardIndex + 1} / ${currentDeck.length}`;

    // Reset flip state
    isFlipped = false;
    flashCardInner.classList.remove('flipped');

    // Update button states
    prevCardBtn.disabled = currentCardIndex === 0;
    nextCardBtn.disabled = currentCardIndex === currentDeck.length - 1;
    prevCardBtn.classList.toggle('opacity-50', currentCardIndex === 0);
    nextCardBtn.classList.toggle('opacity-50', currentCardIndex === currentDeck.length - 1);
}

function flipCard() {
    if (!isFlipped) {
        flashCardInner.classList.add('flipped');
        isFlipped = true;
    } else {
        flashCardInner.classList.remove('flipped');
        isFlipped = false;
    }
}

function nextCard() {
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        isFlipped = false;
        showCard();
    }
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;
        showCard();
    }
}

function shuffleDeck() {
    // Fisher-Yates shuffle
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentCardIndex = 0;
    isFlipped = false;
    showCard();
}

function restartFlashcards() {
    flashResult.classList.add('hidden');
    flashSetup.classList.remove('hidden');
    flashDialectSelect.value = '';
}/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
