//  QUIZ DATA 
const quizDataBank = {
    easy: [
        {
            question: "Which HTML tag is used for the largest heading?",
            a: "<h6>", b: "<head>", c: "<h1>", d: "<heading>",
            correct: "c",
            hint: "The number 1 represents the highest priority.",
            explanation: "The <h1> tag represents the main heading and has the largest default size. Heading tags go from <h1> (largest) to <h6> (smallest).",
            topic: "HTML",
            image: null
        },
        {
            question: "Which property is used to change background color in CSS?",
            a: "color", b: "bgcolor", c: "background-color", d: "fill",
            correct: "c",
            hint: "It uses a hyphen between 'background' and 'color'.",
            explanation: "The 'background-color' property sets the background color of an element. 'color' sets text color, while 'bgcolor' is an old HTML attribute.",
            topic: "CSS"
        },
        {
            question: "What is the correct way to write a JavaScript array?",
            a: "var colors = (1:'red', 2:'blue')", b: "var colors = ['red', 'blue']", c: "var colors = 'red', 'blue'", d: "var colors = 1=('red')",
            correct: "b",
            hint: "Arrays use square brackets [].",
            explanation: "JavaScript arrays are created using square brackets with comma-separated values: ['item1', 'item2'].",
            topic: "JavaScript"
        },
        {
            question: "How do you call a function named 'myFunction' in JavaScript?",
            a: "call myFunction()", b: "myFunction()", c: "call function myFunction()", d: "run myFunction()",
            correct: "b",
            hint: "Just use the name followed by parentheses.",
            explanation: "Functions are called by writing their name followed by parentheses: functionName(). You can pass arguments inside the parentheses.",
            topic: "JavaScript"
        },
        {
            question: "Which CSS property controls the text size?",
            a: "font-style", b: "text-size", c: "font-size", d: "text-style",
            correct: "c",
            hint: "It combines the word 'font' and 'size'.",
            explanation: "The 'font-size' property specifies the size of text. Common values include pixels (px), ems (em), or percentages (%).",
            topic: "CSS"
        },
        {
            question: "What does HTML stand for?",
            a: "Hyper Text Markup Language", b: "High Tech Modern Language", c: "Home Tool Markup Language", d: "Hyperlinks and Text Markup Language",
            correct: "a",
            hint: "Think about hypertext and marking up content.",
            explanation: "HTML stands for HyperText Markup Language. It's the standard markup language for creating web pages.",
            topic: "HTML"
        },
        {
            question: "Which symbol is used for comments in JavaScript?",
            a: "/* */", b: "//", c: "<!-- -->", d: "Both a and b",
            correct: "d",
            hint: "JavaScript supports multiple comment styles.",
            explanation: "JavaScript uses // for single-line comments and /* */ for multi-line comments.",
            topic: "JavaScript"
        },
        {
            question: "What is the correct HTML element for inserting a line break?",
            a: "<break>", b: "<lb>", c: "<br>", d: "<newline>",
            correct: "c",
            hint: "It's a two-letter abbreviation.",
            explanation: "The <br> tag inserts a single line break. It's an empty element, meaning it has no closing tag.",
            topic: "HTML"
        }
    ],
    medium: [
        {
            question: "Which method is used to add an element to the end of an array?",
            a: "push()", b: "pop()", c: "shift()", d: "unshift()",
            correct: "a",
            hint: "Think about pushing something onto a stack.",
            explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
            topic: "JavaScript"
        },
        {
            question: "What does CSS stand for?",
            a: "Computer Style Sheets", b: "Cascading Style Sheets", c: "Creative Style Sheets", d: "Colorful Style Sheets",
            correct: "b",
            hint: "Styles 'cascade' down from parent to child elements.",
            explanation: "CSS stands for Cascading Style Sheets. The 'cascading' refers to the way styles are applied based on specificity and inheritance.",
            topic: "CSS"
        },
        {
            question: "Which event occurs when the user clicks on an HTML element?",
            a: "onchange", b: "onclick", c: "onmouseclick", d: "onmouseover",
            correct: "b",
            hint: "It's the most direct name for clicking.",
            explanation: "The 'onclick' event fires when an element is clicked. It's one of the most commonly used events in JavaScript.",
            topic: "JavaScript"
        },
        {
            question: "How do you select an element with id 'demo' in JavaScript?",
            a: "document.getElement('demo')", b: "document.querySelector('demo')", c: "document.getElementById('demo')", d: "#demo",
            correct: "c",
            hint: "It uses 'ById' for id selection.",
            explanation: "document.getElementById('demo') selects the element with id='demo'. Note: IDs should be unique on a page.",
            topic: "JavaScript"
        },
        {
            question: "Which CSS property is used to change the text color?",
            a: "text-color", b: "font-color", c: "color", d: "text-style",
            correct: "c",
            hint: "It's the simplest option.",
            explanation: "The 'color' property sets the color of text content in an element.",
            topic: "CSS"
        },
        {
            question: "Which property is used to create space between elements?",
            a: "padding", b: "margin", c: "spacing", d: "gap",
            correct: "b",
            hint: "It creates space outside the element's border.",
            explanation: "Margin creates space outside an element's border, while padding creates space inside the border.",
            topic: "CSS"
        },
        {
            question: "What does the 'typeof' operator return for an array?",
            a: "array", b: "object", c: "list", d: "undefined",
            correct: "b",
            hint: "Arrays are a special type of a more general data structure.",
            explanation: "In JavaScript, arrays are actually objects. typeof [] returns 'object'. Use Array.isArray() to check for arrays specifically.",
            topic: "JavaScript"
        }
    ],
    hard: [
        {
            question: "What is closure in JavaScript?",
            a: "A way to close a function", b: "A function with access to its parent scope", c: "A method to end execution", d: "A type of loop",
            correct: "b",
            hint: "Think about scope and access to variables.",
            explanation: "A closure is a function that has access to variables in its outer (parent) scope, even after the outer function has finished executing.",
            topic: "JavaScript"
        },
        {
            question: "Which CSS property controls the stacking order of elements?",
            a: "position", b: "layer", c: "z-index", d: "stack-order",
            correct: "c",
            hint: "It uses a z-coordinate system.",
            explanation: "The z-index property specifies the stack order of positioned elements. Higher values appear on top of lower values.",
            topic: "CSS"
        },
        {
            question: "What does '===' operator check in JavaScript?",
            a: "Value only", b: "Type only", c: "Both value and type", d: "Reference only",
            correct: "c",
            hint: "It's more strict than '=='.",
            explanation: "The === operator checks for both value and type equality (strict equality), while == only checks value (loose equality).",
            topic: "JavaScript"
        },
        {
            question: "What is event bubbling in JavaScript?",
            a: "Events moving from child to parent", b: "Events being canceled", c: "Events running twice", d: "Events in a loop",
            correct: "a",
            hint: "Think about events 'bubbling up' through the DOM.",
            explanation: "Event bubbling is when an event starts from the target element and propagates up through its ancestors to the document root.",
            topic: "JavaScript"
        },
        {
            question: "Which CSS display value makes an element behave like a table?",
            a: "table", b: "block", c: "flex", d: "grid",
            correct: "a",
            hint: "The value directly describes the behavior.",
            explanation: "display: table makes an element behave like a <table> element, along with related values like table-row and table-cell.",
            topic: "CSS"
        },
        {
            question: "What is the purpose of 'use strict' in JavaScript?",
            a: "Enables strict mode for safer code", b: "Makes code run faster", c: "Adds type checking", d: "Enables ES6 features",
            correct: "a",
            hint: "It enforces stricter parsing and error handling.",
            explanation: "'use strict' enables strict mode, which catches common coding mistakes and prevents certain actions, making code more secure.",
            topic: "JavaScript"
        },
        {
            question: "What does the CSS 'position: absolute' do?",
            a: "Positions element relative to the browser window", b: "Positions element relative to its parent", c: "Positions element relative to nearest positioned ancestor", d: "Makes element fixed",
            correct: "c",
            hint: "It looks for a positioned parent.",
            explanation: "position: absolute positions an element relative to its nearest positioned ancestor (not static). If none exists, it uses the document body.",
            topic: "CSS"
        },
        {
            question: "What is hoisting in JavaScript?",
            a: "Moving code to the top", b: "Variable and function declarations moved to top of scope", c: "Lifting elements in DOM", d: "Increasing variable values",
            correct: "b",
            hint: "It's about declarations, not assignments.",
            explanation: "Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution. Variables are hoisted but not initialized.",
            topic: "JavaScript"
        }
    ]
};

//  STATE MANAGEMENT 
const state = {
    currentQuestions: [],
    currentIdx: 0,
    score: 0,
    timeLeft: 15,
    timer: null,
    difficulty: 'medium',
    mode: 'normal',
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    powerups: { hints: 2, skips: 1, time: 1 },
    answers: [],
    answerTimes: [],
    answerChanges: [],
    currentStartTime: null,
    tabSwitches: 0,
    confidenceLevel: 2,
    questionStartTime: null,
    originalAnswers: {}
};

//  DOM ELEMENTS 
const DOM = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    reviewScreen: document.getElementById('review-screen'),
    quizBody: document.getElementById('quiz-body'),
    progressBar: document.getElementById('progress-bar'),
    currentQuestionNum: document.getElementById('current-question-num'),
    totalQuestions: document.getElementById('total-questions'),
    feedback: document.getElementById('feedback'),
    explanation: document.getElementById('explanation'),
    submitBtn: document.getElementById('submit-btn'),
    nextBtn: document.getElementById('next-btn'),
    timeCount: document.getElementById('time-count'),
    timerProgress: document.getElementById('timer-progress'),
    currentScore: document.getElementById('current-score'),
    streakContainer: document.getElementById('streak-container'),
    streakCount: document.getElementById('streak-count'),
    multiplier: document.getElementById('multiplier'),
    confidenceContainer: document.getElementById('confidence-container'),
    confidenceSlider: document.getElementById('confidence-slider'),
    attentionWarning: document.getElementById('attention-warning'),
    notificationToast: document.getElementById('notification-toast')
};

//  INITIALIZATION 
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    createParticles();
    loadHighScores();
});

function initializeApp() {
    // No theme or sound initialization needed
}

function setupEventListeners() {
    // Welcome screen    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', selectDifficulty);
    });
    
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    
    // Quiz controls
    DOM.submitBtn.addEventListener('click', checkAnswer);
    DOM.nextBtn.addEventListener('click', nextQuestion);
    
    // Powerups
    document.getElementById('hint-powerup').addEventListener('click', useHint);
    document.getElementById('skip-powerup').addEventListener('click', skipQuestion);
    document.getElementById('time-powerup').addEventListener('click', addTime);
    
    // Confidence slider
    document.getElementById('confidence-slider').addEventListener('input', updateConfidence);
    
    // Result screen
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('retry-btn').addEventListener('click', resetQuiz);
    document.getElementById('share-btn').addEventListener('click', shareResults);
    
    // Review screen
    document.getElementById('close-review-btn').addEventListener('click', closeReview);
    document.getElementById('back-to-results-btn').addEventListener('click', closeReview);
    
    // Tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

//  DIFFICULTY SELECTION 
function selectDifficulty(e) {
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    e.target.closest('.difficulty-btn').classList.add('active');
    state.difficulty = e.target.closest('.difficulty-btn').dataset.difficulty;
}

//  START QUIZ 
function startQuiz() {
    // Get selected mode
    const modeRadio = document.querySelector('input[name="quiz-mode"]:checked');
    state.mode = modeRadio ? modeRadio.value : 'normal';
    
    // Prepare questions
    prepareQuestions();
    
    // Show quiz screen
    DOM.welcomeScreen.classList.add('hidden');
    DOM.quizScreen.classList.remove('hidden');
    
    // Show confidence slider if in confidence mode
    if (state.mode === 'confidence') {
        DOM.confidenceContainer.classList.remove('hidden');
    }
    
    // Load first question
    loadQuestion();
}

function prepareQuestions() {
    // Get questions based on difficulty
    let questions = [...quizDataBank[state.difficulty]];
    
    // Randomize questions
    questions = shuffleArray(questions);
    
    // Randomize options for each question
    questions = questions.map(q => {
        const options = shuffleArray([
            { key: 'a', value: q.a },
            { key: 'b', value: q.b },
            { key: 'c', value: q.c },
            { key: 'd', value: q.d }
        ]);
        
        const newQuestion = { ...q };
        options.forEach((opt, idx) => {
            const keys = ['a', 'b', 'c', 'd'];
            newQuestion[keys[idx]] = opt.value;
            if (opt.key === q.correct) {
                newQuestion.correct = keys[idx];
            }
        });
        
        return newQuestion;
    });
    
    state.currentQuestions = questions;
    DOM.totalQuestions.textContent = questions.length;
}

//  LOAD QUESTION 
function loadQuestion() {
    resetQuestionState();
    
    const data = state.currentQuestions[state.currentIdx];
    state.questionStartTime = Date.now();
    
    // Update progress
    const progress = ((state.currentIdx) / state.currentQuestions.length) * 100;
    DOM.progressBar.style.width = `${progress}%`;
    DOM.currentQuestionNum.textContent = state.currentIdx + 1;
    
    // Build question HTML with visible options
    let questionHTML = `<div class="question">${data.question}</div>`;
    
    // Add image if exists
    if (data.image) {
        questionHTML += `<img src="${data.image}" alt="Question image" class="question-image">`;
    }
    
    questionHTML += `<div class="options">`;
    ['a', 'b', 'c', 'd'].forEach(option => {
        if (data[option]) {  // Only add option if it exists
            questionHTML += `
                <label class="option-label">
                    <input type="radio" name="answer" value="${option}">
                    <span class="option-text">${data[option]}</span>
                </label>
            `;
        }
    });
    questionHTML += `</div>`;
    
    DOM.quizBody.innerHTML = questionHTML;
    
    // Track answer changes
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', trackAnswerChange);
    });
    
    // Start timer
    startTimer();
    
    // Check for boss question
    if ((state.currentIdx + 1) % 5 === 0 && state.currentIdx > 0) {
        showNotification('😈', 'Boss Question! Double Points!');
    }
}

function resetQuestionState() {
    DOM.feedback.classList.add('hidden');
    DOM.explanation.classList.add('hidden');
    DOM.nextBtn.classList.add('hidden');
    DOM.submitBtn.classList.remove('hidden');
    clearInterval(state.timer);
    
    if (state.mode === 'confidence') {
        document.getElementById('confidence-slider').value = 2;
        updateConfidence({ target: { value: 2 } });
    }
    
    delete state.originalAnswers[state.currentIdx];
}

//  TIMER 
function startTimer() {
    // Set time based on difficulty and mode
    if (state.mode === 'stress-free') {
        state.timeLeft = 999;
        document.querySelector('.timer-container').style.display = 'none';
        return;
    }
    
    state.timeLeft = state.difficulty === 'easy' ? 20 : state.difficulty === 'medium' ? 15 : 10;
    const totalTime = state.timeLeft;
    
    DOM.timeCount.textContent = state.timeLeft;
    
    const circumference = 2 * Math.PI * 34;
    DOM.timerProgress.style.strokeDasharray = circumference;
    DOM.timerProgress.style.strokeDashoffset = 0;
    
    state.timer = setInterval(() => {
        state.timeLeft--;
        DOM.timeCount.textContent = state.timeLeft;
        
        const offset = circumference - (state.timeLeft / totalTime) * circumference;
        DOM.timerProgress.style.strokeDashoffset = offset;
        
        if (state.timeLeft <= 5) {
            DOM.timeCount.classList.add('timer-warning');
        }
        
        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            checkAnswer(true);
        }
    }, 1000);
}

//  ANSWER TRACKING 
function trackAnswerChange(e) {
    const currentQuestion = state.currentIdx;
    
    if (!state.originalAnswers[currentQuestion]) {
        state.originalAnswers[currentQuestion] = e.target.value;
    } else if (state.originalAnswers[currentQuestion] !== e.target.value) {
        const existing = state.answerChanges.find(ac => ac.question === currentQuestion);
        if (!existing) {
            state.answerChanges.push({
                question: currentQuestion,
                from: state.originalAnswers[currentQuestion],
                to: e.target.value
            });
        }
    }
}

//  CHECK ANSWER 
function checkAnswer(timedOut = false) {
    const selected = document.querySelector('input[name="answer"]:checked');
    
    if (!selected && !timedOut) {
        showNotification('⚠️', 'Please select an answer!');
        DOM.submitBtn.classList.add('shake-animation');
        setTimeout(() => DOM.submitBtn.classList.remove('shake-animation'), 500);
        return;
    }
    
    clearInterval(state.timer);
    DOM.timeCount.classList.remove('timer-warning');
    
    const data = state.currentQuestions[state.currentIdx];
    const isCorrect = selected && selected.value === data.correct;
    const timeTaken = Math.floor((Date.now() - state.questionStartTime) / 1000);
    
    // Calculate points
    let points = 0;
    if (isCorrect) {
        points = 1;
        
        // Boss question bonus
        if ((state.currentIdx + 1) % 5 === 0) {
            points *= 2;
        }
        
        // Streak multiplier
        state.streak++;
        state.multiplier = Math.min(3, Math.floor(state.streak / 3) + 1);
        points *= state.multiplier;
        
        // Confidence mode bonus/penalty
        if (state.mode === 'confidence') {
            if (state.confidenceLevel === 3) {
                points += 1; // Bonus for high confidence
            }
        }
        
        state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else {
        state.streak = 0;
        state.multiplier = 1;
        
        // Confidence mode penalty
        if (state.mode === 'confidence' && state.confidenceLevel === 3) {
            points = -1; // Penalty for overconfidence
        }
    }
    
    state.score += points;
    DOM.currentScore.textContent = state.score;
    
    // Record answer
    state.answers.push({
        question: state.currentIdx,
        userAnswer: selected ? selected.value : null,
        correct: isCorrect,
        timeTaken: timeTaken,
        topic: data.topic
    });
    
    state.answerTimes.push(timeTaken);
    
    // Visual feedback
    const labels = document.querySelectorAll('.options label');
    labels.forEach(label => {
        const input = label.querySelector('input');
        if (input.value === data.correct) {
            label.classList.add('option-correct');
        }
        if (selected && input === selected && !isCorrect) {
            label.classList.add('option-wrong');
        }
        input.disabled = true;
    });
    
    // Show feedback
    DOM.feedback.innerHTML = `
        <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
        <span>${isCorrect ? 'Correct! ' + (points > 1 ? `+${points} points!` : 'Well done!') : 'Incorrect. ' + data.hint}</span>
    `;
    DOM.feedback.className = `feedback-container ${isCorrect ? 'correct' : 'wrong'}`;
    DOM.feedback.classList.remove('hidden');
    
    // Show explanation
    DOM.explanation.innerHTML = `<strong>Explanation:</strong> ${data.explanation}`;
    DOM.explanation.classList.remove('hidden');
    
    // Update streak display
    if (state.streak >= 3) {
        DOM.streakContainer.classList.remove('hidden');
        DOM.streakCount.textContent = state.streak;
        DOM.multiplier.textContent = state.multiplier;
    } else {
        DOM.streakContainer.classList.add('hidden');
    }
    
    // Check for power-up rewards
    if (state.streak === 3) {
        state.powerups.hints++;
        updatePowerupDisplay();
        showNotification('💡', 'Streak reward: +1 Hint!');
    }
    
    // Update buttons
    DOM.submitBtn.classList.add('hidden');
    DOM.nextBtn.classList.remove('hidden');
    
    // Fast answer detection (anti-guess)
    if (timeTaken < 2 && state.currentIdx < state.currentQuestions.length - 1) {
        showNotification('⚠️', 'Please read carefully before answering!');
    }
}

//  NEXT QUESTION 
function nextQuestion() {
    state.currentIdx++;
    
    if (state.currentIdx < state.currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

//  SHOW RESULTS 
function showResults() {
    DOM.quizScreen.classList.add('hidden');
    DOM.resultScreen.classList.remove('hidden');
    
    const totalQuestions = state.currentQuestions.length;
    const percentage = Math.round((state.answers.filter(a => a.correct).length / totalQuestions) * 100);
    
    // Animate score circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100) * circumference;
    const scoreCircle = document.getElementById('score-circle');
    scoreCircle.style.strokeDasharray = circumference;
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
    
    // Display score
    document.getElementById('score-text').textContent = `${state.answers.filter(a => a.correct).length}/${totalQuestions}`;
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    
    // Result message
    let message = '';
    if (percentage >= 90) {
        message = '🌟 Outstanding! You\'re a master!';
    } else if (percentage >= 70) {
        message = '👏 Great job! Keep it up!';
    } else if (percentage >= 50) {
        message = '👍 Good effort! Room to improve.';
    } else {
        message = '💪 Keep practicing! You\'ll get better!';
    }
    
    document.getElementById('result-title').textContent = message;
    document.getElementById('result-message').textContent = `You scored ${state.score} points with a ${state.bestStreak} question streak!`;
    
    // Analytics
    displayAnalytics();
    
    // Save score
    saveScore();
    
    // Display leaderboard
    displayLeaderboard();
}

//  ANALYTICS 
function displayAnalytics() {
    // Time analytics
    const avgTime = Math.round(state.answerTimes.reduce((a, b) => a + b, 0) / state.answerTimes.length);
    const fastestTime = Math.min(...state.answerTimes);
    const slowestTime = Math.max(...state.answerTimes);
    
    document.getElementById('avg-time').textContent = `${avgTime}s`;
    document.getElementById('fastest-time').textContent = `${fastestTime}s`;
    document.getElementById('slowest-time').textContent = `${slowestTime}s`;
    document.getElementById('best-streak').textContent = state.bestStreak;
    
    // Topic performance
    const topics = {};
    state.answers.forEach(answer => {
        const topic = state.currentQuestions[answer.question].topic;
        if (!topics[topic]) {
            topics[topic] = { correct: 0, total: 0 };
        }
        topics[topic].total++;
        if (answer.correct) topics[topic].correct++;
    });
    
    const topicBreakdown = document.getElementById('topic-breakdown');
    topicBreakdown.innerHTML = '';
    Object.keys(topics).forEach(topic => {
        const percent = Math.round((topics[topic].correct / topics[topic].total) * 100);
        topicBreakdown.innerHTML += `
            <div class="topic-bar">
                <div class="topic-name">
                    <span>${topic}</span>
                    <span>${percent}%</span>
                </div>
                <div class="topic-progress">
                    <div class="topic-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    });
    
    // Heatmap
    const heatmap = document.getElementById('question-heatmap');
    heatmap.innerHTML = '';
    state.answers.forEach((answer, idx) => {
        let difficulty = 'easy';
        if (answer.timeTaken > 10 || !answer.correct) {
            difficulty = 'hard';
        } else if (answer.timeTaken > 5) {
            difficulty = 'medium';
        }
        
        const cell = document.createElement('div');
        cell.className = `heatmap-cell heatmap-${difficulty}`;
        cell.textContent = idx + 1;
        cell.title = `Q${idx + 1}: ${answer.timeTaken}s, ${answer.correct ? 'Correct' : 'Wrong'}`;
        heatmap.appendChild(cell);
    });
    
    // Answer changes
    if (state.answerChanges.length > 0) {
        document.getElementById('answer-changes-section').classList.remove('hidden');
        const changesList = document.getElementById('answer-changes-list');
        changesList.innerHTML = '';
        state.answerChanges.forEach(change => {
            const li = document.createElement('li');
            li.textContent = `Question ${change.question + 1}: Changed from ${change.from.toUpperCase()} → ${change.to.toUpperCase()}`;
            changesList.appendChild(li);
        });
    }
}

//  SAVE SCORE 
function saveScore() {
    const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    const newScore = {
        score: state.answers.filter(a => a.correct).length,
        total: state.currentQuestions.length,
        points: state.score,
        difficulty: state.difficulty,
        mode: state.mode,
        date: new Date().toISOString(),
        streak: state.bestStreak
    };
    
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score || b.points - a.points);
    
    localStorage.setItem('quizScores', JSON.stringify(scores));
}

function loadHighScores() {
    const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    const previewList = document.getElementById('preview-scores');
    
    if (scores.length === 0) {
        previewList.innerHTML = '<li>No scores yet. Be the first!</li>';
        return;
    }
    
    const topScores = scores.slice(0, 5);
    previewList.innerHTML = topScores.map((score, idx) => 
        `<li>🥇 ${score.score}/${score.total} - ${score.difficulty}</li>`
    ).join('');
}

function displayLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    const scoreList = document.getElementById('score-list');
    
    const topScores = scores.slice(0, 10);
    scoreList.innerHTML = topScores.map((score, idx) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[idx] || `${idx + 1}.`;
        const date = new Date(score.date).toLocaleDateString();
        return `
            <li>
                <span class="score-rank">${medal}</span>
                <span>${score.score}/${score.total} (${score.points} pts)</span>
                <span style="margin-left: auto; font-size: 0.9rem; color: var(--text-light);">${date}</span>
            </li>
        `;
    }).join('');
}

//  REVIEW ANSWERS 
function showReview() {
    DOM.resultScreen.classList.add('hidden');
    DOM.reviewScreen.classList.remove('hidden');
    
    const reviewContent = document.getElementById('review-content');
    reviewContent.innerHTML = '';
    
    state.answers.forEach((answer, idx) => {
        const data = state.currentQuestions[answer.question];
        const userAnswerText = answer.userAnswer ? data[answer.userAnswer] : 'Not answered';
        const correctAnswerText = data[data.correct];
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-question">
                <strong>Question ${idx + 1}:</strong> ${data.question}
            </div>
            <div class="review-answer ${answer.correct ? 'correct-answer' : 'your-answer'}">
                <strong>Your answer:</strong> ${userAnswerText} ${answer.correct ? '✅' : '❌'}
            </div>
            ${!answer.correct ? `
                <div class="review-answer correct-answer">
                    <strong>Correct answer:</strong> ${correctAnswerText} ✅
                </div>
            ` : ''}
            <div style="margin-top: 10px; color: var(--text-light);">
                <em>${data.explanation}</em>
            </div>
            <div style="margin-top: 8px; font-size: 0.9rem; color: var(--text-light);">
                ⏱️ Time taken: ${answer.timeTaken}s
            </div>
        `;
        reviewContent.appendChild(reviewItem);
    });
}

function closeReview() {
    DOM.reviewScreen.classList.add('hidden');
    DOM.resultScreen.classList.remove('hidden');
}

//  POWER-UPS 
function useHint() {
    if (state.powerups.hints <= 0) {
        showNotification('❌', 'No hints available!');
        return;
    }
    
    const data = state.currentQuestions[state.currentIdx];
    showNotification('💡', data.hint);
    state.powerups.hints--;
    updatePowerupDisplay();
}

function skipQuestion() {
    if (state.powerups.skips <= 0) {
        showNotification('❌', 'No skips available!');
        return;
    }
    
    state.powerups.skips--;
    updatePowerupDisplay();
    nextQuestion();
}

function addTime() {
    if (state.powerups.time <= 0) {
        showNotification('❌', 'No time boosts available!');
        return;
    }
    
    state.timeLeft += 10;
    DOM.timeCount.textContent = state.timeLeft;
    state.powerups.time--;
    updatePowerupDisplay();
    showNotification('⏱️', '+10 seconds added!');
}

function updatePowerupDisplay() {
    document.getElementById('hint-count').textContent = state.powerups.hints;
    document.getElementById('skip-count').textContent = state.powerups.skips;
    document.getElementById('time-count').textContent = state.powerups.time;
    
    document.getElementById('hint-powerup').disabled = state.powerups.hints <= 0;
    document.getElementById('skip-powerup').disabled = state.powerups.skips <= 0;
    document.getElementById('time-powerup').disabled = state.powerups.time <= 0;
}

//  CONFIDENCE MODE 
function updateConfidence(e) {
    const value = parseInt(e.target.value);
    state.confidenceLevel = value;
    
    const labels = ['😕 Not sure', '😃 Somewhat sure', '😎 Very sure'];
    const emojis = ['😕', '😃', '😎'];
    
    document.querySelector('.confidence-emoji').textContent = emojis[value - 1];
    document.querySelector('.confidence-label').textContent = labels[value - 1];
}

//  VISIBILITY CHANGE 
function handleVisibilityChange() {
    if (document.hidden && !DOM.quizScreen.classList.contains('hidden')) {
        state.tabSwitches++;
        
        if (state.tabSwitches >= 2) {
            DOM.attentionWarning.classList.remove('hidden');
            setTimeout(() => {
                DOM.attentionWarning.classList.add('hidden');
            }, 3000);
        }
    }
}

//  KEYBOARD SHORTCUTS 
function handleKeyboard(e) {
    if (DOM.quizScreen.classList.contains('hidden')) return;
    
    // Number keys for options
    if (e.key >= '1' && e.key <= '4') {
        const options = ['a', 'b', 'c', 'd'];
        const radio = document.querySelector(`input[value="${options[e.key - 1]}"]`);
        if (radio && !radio.disabled) radio.checked = true;
    }
    
    // Enter to submit/next
    if (e.key === 'Enter') {
        if (!DOM.submitBtn.classList.contains('hidden')) {
            checkAnswer();
        } else if (!DOM.nextBtn.classList.remove('hidden')) {
            nextQuestion();
        }
    }
}

//  SHARE RESULTS 
function shareResults() {
    const score = state.answers.filter(a => a.correct).length;
    const total = state.currentQuestions.length;
    const percentage = Math.round((score / total) * 100);
    
    const text = `I scored ${score}/${total} (${percentage}%) on the Ultimate Quiz Challenge! 🎓 Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Results',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text);
        showNotification('📋', 'Results copied to clipboard!');
    }
}

//  RESET QUIZ 
function resetQuiz() {
    // Reset state
    state.currentIdx = 0;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.multiplier = 1;
    state.answers = [];
    state.answerTimes = [];
    state.answerChanges = [];
    state.tabSwitches = 0;
    state.powerups = { hints: 2, skips: 1, time: 1 };
    state.originalAnswers = {};
    
    // Update display
    DOM.currentScore.textContent = '0';
    updatePowerupDisplay();
    
    // Show welcome screen
    DOM.resultScreen.classList.add('hidden');
    DOM.welcomeScreen.classList.remove('hidden');
    
    // Reload high scores
    loadHighScores();
}

//  UTILITY FUNCTIONS 
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showNotification(icon, message) {
    DOM.notificationToast.querySelector('.toast-icon').textContent = icon;
    DOM.notificationToast.querySelector('.toast-message').textContent = message;
    DOM.notificationToast.classList.remove('hidden');
    
    setTimeout(() => {
        DOM.notificationToast.classList.add('hidden');
    }, 3000);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}