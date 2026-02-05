// DOM ELEMENTS

const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const restartBtn = document.querySelector('#restart-icon-btn');
const undoBtn = document.querySelector('#undo-btn');
const soundToggleBtn = document.querySelector('#sound-toggle-btn');
const musicToggleBtn = document.querySelector('#music-toggle-btn');
const themeBtn = document.querySelector('#theme-cycle-btn');
const resetScoreBtn = document.querySelector('#reset-score-btn');
const shareBtn = document.querySelector('#share-btn');
const historyToggleBtn = document.querySelector('#history-toggle-btn');
const achievementsBtn = document.querySelector('#achievements-btn');
const winningLine = document.querySelector('#winning-line');
const modeBtn = document.querySelector('#mode-toggle');
const tournamentToggleBtn = document.querySelector('#tournament-toggle');
const skinsBtn = document.querySelector('#skins-btn');
const p1Input = document.querySelector('#p1-name');
const p2Input = document.querySelector('#p2-name');
const scoreXEl = document.querySelector('#score-x');
const scoreOEl = document.querySelector('#score-o');
const scoreDrawEl = document.querySelector('#score-draw');
const timerBar = document.querySelector('#timer-bar');
const timerFill = document.querySelector('#timer-fill');
const aiDifficultyContainer = document.querySelector('#ai-difficulty-container');
const aiDifficultySelect = document.querySelector('#ai-difficulty');

// Tournament elements
const tournamentMode = document.querySelector('#tournament-mode');
const p1Label = document.querySelector('#p1-label');
const p2Label = document.querySelector('#p2-label');
const p1WinDots = document.querySelector('#p1-wins');
const p2WinDots = document.querySelector('#p2-wins');

// Modal elements
const modal = document.querySelector('#winner-modal');
const modalIcon = document.querySelector('#modal-icon');
const modalTitle = document.querySelector('#modal-title');
const modalMsg = document.querySelector('#modal-message');
const btnContinue = document.querySelector('#btn-continue');
const btnExit = document.querySelector('#btn-exit');

// Skins modal
const skinsModal = document.querySelector('#skins-modal');
const skinOptions = document.querySelectorAll('.skin-option');
const closeSkinsBtn = document.querySelector('#close-skins');

// Achievements modal
const achievementsModal = document.querySelector('#achievements-modal');
const achievementsList = document.querySelector('#achievements-list');
const closeAchievementsBtn = document.querySelector('#close-achievements');
const achievementToast = document.querySelector('#achievement-toast');
const toastMessage = document.querySelector('#toast-message');

// History sidebar
const historySidebar = document.querySelector('#history-sidebar');
const historyList = document.querySelector('#history-list');
const closeHistoryBtn = document.querySelector('#close-history');

 
// GAME VARIABLES
 

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let isPvP = true;
let aiDifficulty = "impossible"; // easy, medium, impossible
let scores = { X: 0, O: 0, draws: 0 };
let isMuted = false;
let isMusicMuted = false;
let gameStartTime = null;
let moveHistory = [];
let boardHistory = [];
let playerHistory = [];
let currentSkin = "classic";
let isTournamentMode = false;
let tournamentWins = { X: 0, O: 0 };
let consecutiveWins = 0;
let lastWinner = null;

// Timer variables
let timerEnabled = false;
let timerDuration = 10000; // 10 seconds
let timerInterval = null;
let timerStartTime = null;

// Themes
const themes = ['theme-neon', 'theme-sunset', 'theme-ocean', 'theme-forest', 'theme-light'];
let currentThemeIndex = 0;

// Win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Skins configuration
const skins = {
    classic: { x: 'X', o: 'O' },
    'fire-ice': { x: '🔥', o: '❄️' },
    'sun-moon': { x: '🌞', o: '🌙' },
    'rocket-ufo': { x: '🚀', o: '🛸' },
    'star-heart': { x: '⭐', o: '❤️' },
    'skull-ghost': { x: '💀', o: '👻' }
};

// Achievements definition
const achievements = [
    {
        id: 'first_blood',
        title: '🏆 First Blood',
        description: 'Win your first game',
        unlocked: false,
        check: () => scores.X > 0 || scores.O > 0
    },
    {
        id: 'machine_breaker',
        title: '🤖 Machine Breaker',
        description: 'Beat the AI on Impossible difficulty',
        unlocked: false,
        check: () => false // Will be checked manually
    },
    {
        id: 'speedester',
        title: '⚡ Speedester',
        description: 'Win a game in under 10 seconds',
        unlocked: false,
        check: () => false // Will be checked manually
    },
    {
        id: 'invincible',
        title: '🛡️ Invincible',
        description: 'Win 5 games in a row',
        unlocked: false,
        check: () => consecutiveWins >= 5
    },
    {
        id: 'draw_master',
        title: '🤝 Draw Master',
        description: 'Achieve 3 draws',
        unlocked: false,
        check: () => scores.draws >= 3
    },
    {
        id: 'completionist',
        title: '🎖️ Completionist',
        description: 'Try all skin themes',
        unlocked: false,
        check: () => false // Will be tracked separately
    },
    {
        id: 'player',
        title: '🔥 Passionated Player',
        description: 'Play 20 games',
        unlocked: false,
        check: () => (scores.X + scores.O + scores.draws) >= 20
    },
    {
        id: 'theme_explorer',
        title: '🎨 Theme Explorer',
        description: 'Try all color themes',
        unlocked: false,
        check: () => false // Will be tracked separately
    }
];

let unlockedSkins = ['classic'];
let exploredThemes = [themes[0]];
let gamesPlayed = 0;

 
// AUDIO CONTEXT
 

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let backgroundMusic = null;
let musicGain = null;

 
// INITIALIZATION
 

loadSettings();
initializeGame();
initializeMusic();
renderAchievements();

function initializeGame() {
    // Event listeners for cells
    cells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
        cell.addEventListener('keydown', handleKeyboardInput);
    });

    // Button listeners
    restartBtn.addEventListener('click', restartRound);
    undoBtn.addEventListener('click', undoMove);
    themeBtn.addEventListener('click', cycleTheme);
    soundToggleBtn.addEventListener('click', toggleSound);
    musicToggleBtn.addEventListener('click', toggleMusic);
    resetScoreBtn.addEventListener('click', resetScores);
    shareBtn.addEventListener('click', shareResult);
    modeBtn.addEventListener('click', toggleGameMode);
    tournamentToggleBtn.addEventListener('click', toggleTournamentMode);
    skinsBtn.addEventListener('click', () => openModal(skinsModal));
    historyToggleBtn.addEventListener('click', toggleHistorySidebar);
    achievementsBtn.addEventListener('click', () => openModal(achievementsModal));

    // Modal listeners
    btnContinue.addEventListener('click', () => {
        closeModal(modal);
        restartRound();
    });

    btnExit.addEventListener('click', () => {
        closeModal(modal);
        resetGameFull();
    });

    closeSkinsBtn.addEventListener('click', () => closeModal(skinsModal));
    closeAchievementsBtn.addEventListener('click', () => closeModal(achievementsModal));
    closeHistoryBtn.addEventListener('click', () => historySidebar.classList.remove('active'));

    // Skin selection
    skinOptions.forEach(option => {
        option.addEventListener('click', () => selectSkin(option.dataset.skin));
    });

    // AI difficulty
    aiDifficultySelect.addEventListener('change', (e) => {
        aiDifficulty = e.target.value;
        localStorage.setItem('aiDifficulty', aiDifficulty);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeyboard);

    // Mouse parallax for background
    document.addEventListener('mousemove', handleMouseParallax);

    running = true;
    gameStartTime = Date.now();
    updateStatus();
    saveHistory();
}

 
// PARALLAX EFFECT
 

function handleMouseParallax(e) {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
}

 
// BACKGROUND MUSIC
 

function initializeMusic() {
    try {
        // Create oscillators for ambient background music
        musicGain = audioCtx.createGain();
        musicGain.gain.value = 0.05; // Very low volume
        musicGain.connect(audioCtx.destination);
    } catch (e) {
        console.log('Music initialization failed', e);
    }
}

function toggleMusic() {
    isMusicMuted = !isMusicMuted;
    updateMusicIcon();
    if (isMusicMuted) {
        stopBackgroundMusic();
    } else {
        playBackgroundMusic();
    }
    localStorage.setItem('isMusicMuted', isMusicMuted);
}

function playBackgroundMusic() {
    if (isMusicMuted || !musicGain) return;
    
    // Simple ambient synth using oscillators
    try {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 220;
        osc2.frequency.value = 330;
        
        osc1.connect(musicGain);
        osc2.connect(musicGain);
        
        osc1.start();
        osc2.start();
        
        backgroundMusic = { osc1, osc2 };
    } catch (e) {
        console.log('Music playback failed', e);
    }
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        try {
            backgroundMusic.osc1.stop();
            backgroundMusic.osc2.stop();
        } catch (e) {}
        backgroundMusic = null;
    }
}

function updateMusicIcon() {
    const musicIcon = document.querySelector('#music-icon');
    if (isMusicMuted) {
        musicToggleBtn.classList.add('muted');
        musicIcon.innerHTML = '<path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h-4V3h4v4zm0 5.55l-4-4V7h4v5.55z"/>';
    } else {
        musicToggleBtn.classList.remove('muted');
        musicIcon.innerHTML = '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>';
    }
}

 
// THEME CYCLING
 

function cycleTheme() {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
    
    if (!exploredThemes.includes(themes[currentThemeIndex])) {
        exploredThemes.push(themes[currentThemeIndex]);
        if (exploredThemes.length === themes.length) {
            unlockAchievement('theme_explorer');
        }
    }
    
    localStorage.setItem('ticTacToeThemeIndex', currentThemeIndex);
    localStorage.setItem('exploredThemes', JSON.stringify(exploredThemes));
    
    updateStatus();
    if (winningLine.style.width !== '0px') {
        updateWinningLineColor();
    }
}

function updateWinningLineColor() {
    const rootStyles = getComputedStyle(document.body);
    const colorVar = currentPlayer === "X" ? '--highlight-x' : '--highlight-o';
    winningLine.style.backgroundColor = rootStyles.getPropertyValue(colorVar);
}

 
// SOUND CONTROLS
 

function toggleSound() {
    isMuted = !isMuted;
    updateSoundIcon();
    localStorage.setItem('isMuted', isMuted);
}

function updateSoundIcon() {
    const soundIcon = document.querySelector('#sound-icon');
    if (isMuted) {
        soundToggleBtn.classList.add('muted');
        soundIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
        soundToggleBtn.classList.remove('muted');
        soundIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
}

 
// SKINS SYSTEM
 

function selectSkin(skinName) {
    currentSkin = skinName;
    skinOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-skin="${skinName}"]`).classList.add('selected');
    
    if (!unlockedSkins.includes(skinName)) {
        unlockedSkins.push(skinName);
        if (unlockedSkins.length === Object.keys(skins).length) {
            unlockAchievement('completionist');
        }
        localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));
    }
    
    localStorage.setItem('currentSkin', skinName);
    refreshBoard();
}

function refreshBoard() {
    cells.forEach((cell, index) => {
        if (board[index] !== "") {
            cell.textContent = skins[currentSkin][board[index].toLowerCase()];
        }
    });
}

 
// TOURNAMENT MODE
 

function toggleTournamentMode() {
    isTournamentMode = !isTournamentMode;
    
    if (isTournamentMode) {
        tournamentToggleBtn.classList.add('active');
        tournamentMode.style.display = 'block';
        tournamentWins = { X: 0, O: 0 };
        updateTournamentDisplay();
    } else {
        tournamentToggleBtn.classList.remove('active');
        tournamentMode.style.display = 'none';
    }
    
    restartRound();
}

function updateTournamentDisplay() {
    p1Label.textContent = p1Input.value;
    p2Label.textContent = p2Input.value;
    
    const p1Dots = p1WinDots.querySelectorAll('.dot');
    const p2Dots = p2WinDots.querySelectorAll('.dot');
    
    p1Dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < tournamentWins.X);
    });
    
    p2Dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < tournamentWins.O);
    });
}

 
// GAMEPLAY
 

function cellClicked() {
    const index = this.getAttribute('data-index');
    if (board[index] !== "" || !running) return;

    makeMove(this, index);
}

function makeMove(cell, index) {
    // Save state for undo
    saveHistory();
    
    updateCell(cell, index);
    playSound('click');
    
    // Vibrate on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Add to move history
    addMoveToHistory(index);
    
    checkWinner();

    if (running && !isPvP && currentPlayer === "O") {
        setTimeout(aiMove, 600);
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = skins[currentSkin][currentPlayer.toLowerCase()];
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    updateStatus();
    
    if (timerEnabled) {
        startTurnTimer();
    }
}

function updateStatus() {
    const pName = currentPlayer === "X" ? p1Input.value : p2Input.value;
    const rootStyles = getComputedStyle(document.body);
    const color = currentPlayer === "X" ? rootStyles.getPropertyValue('--highlight-x') : rootStyles.getPropertyValue('--highlight-o');
    statusText.innerHTML = `<span style="color:${color}">${pName}</span>'s Turn`;
}

 
// AI LOGIC WITH DIFFICULTY LEVELS
 

function aiMove() {
    let bestSpot;
    
    switch(aiDifficulty) {
        case 'easy':
            bestSpot = getRandomMove();
            break;
        case 'medium':
            bestSpot = getMediumMove();
            break;
        case 'impossible':
        default:
            bestSpot = minimax(board, "O").index;
            if (board.filter(e => e === "").length === 8 && board[4] === "") {
                bestSpot = 4; // Take center on first move
            }
            break;
    }
    
    const aiCell = document.querySelector(`.cell[data-index='${bestSpot}']`);
    updateCell(aiCell, bestSpot);
    playSound('click');
    
    if ('vibrate' in navigator) {
        navigator.vibrate(30);
    }
    
    addMoveToHistory(bestSpot);
    checkWinner();
}

function getRandomMove() {
    const availableSpots = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function getMediumMove() {
    // First, try to win
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            if (checkWinState(board, "O")) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // Then, block player from winning
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            if (checkWinState(board, "X")) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // Otherwise, random move
    return getRandomMove();
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    
    if (checkWinState(newBoard, "X")) return { score: -10 };
    if (checkWinState(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;
        
        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }
        
        newBoard[availSpots[i]] = "";
        moves.push(move);
    }
    
    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}

function checkWinState(b, p) {
    return winConditions.some(c => b[c[0]] === p && b[c[1]] === p && b[c[2]] === p);
}

 
// WIN DETECTION & HANDLING
 

function checkWinner() {
    let roundWon = false;
    let winCombo = [];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winCombo = winConditions[i];
            break;
        }
    }

    if (roundWon) {
        handleWin(winCombo);
    } else if (!board.includes("")) {
        handleDraw();
    } else {
        changePlayer();
    }
}

function handleWin(combo) {
    running = false;
    stopTurnTimer();
    
    const winnerName = currentPlayer === "X" ? p1Input.value : p2Input.value;
    const gameTime = (Date.now() - gameStartTime) / 1000;
    
    scores[currentPlayer]++;
    gamesPlayed++;
    
    // Check for consecutive wins
    if (lastWinner === currentPlayer) {
        consecutiveWins++;
    } else {
        consecutiveWins = 1;
        lastWinner = currentPlayer;
    }
    
    // Tournament mode
    if (isTournamentMode) {
        tournamentWins[currentPlayer]++;
        updateTournamentDisplay();
        
        if (tournamentWins[currentPlayer] >= 3) {
            handleTournamentWin(winnerName);
            return;
        }
    }
    
    saveSettings();
    updateScoreDisplay();
    drawWinningLine(combo);
    createParticles();
    playSound('win');
    
    // Check achievements
    checkAchievements(gameTime);
    
    setTimeout(() => {
        openWinnerModal("🏆 Winner!", `${winnerName} wins this round!`);
    }, 1000);
}

function handleTournamentWin(winnerName) {
    createConfetti();
    playSound('win');
    
    setTimeout(() => {
        openWinnerModal("👑 CHAMPION!", `${winnerName} wins the tournament!`);
        tournamentWins = { X: 0, O: 0 };
        updateTournamentDisplay();
    }, 1500);
}

function handleDraw() {
    running = false;
    stopTurnTimer();
    scores.draws++;
    gamesPlayed++;
    consecutiveWins = 0;
    lastWinner = null;
    
    saveSettings();
    updateScoreDisplay();
    playSound('draw');
    
    checkAchievements();
    
    setTimeout(() => {
        openWinnerModal("🤝 Draw!", "No one wins this round.");
    }, 500);
}

function openWinnerModal(title, msg) {
    modalIcon.textContent = title.includes('CHAMPION') ? '👑' : (title.includes('Draw') ? '🤝' : '🏆');
    modalTitle.textContent = title;
    modalMsg.textContent = msg;
    openModal(modal);
}

 
// ACHIEVEMENTS SYSTEM
 

function checkAchievements(gameTime) {
    // First blood
    if ((scores.X + scores.O) === 1) {
        unlockAchievement('first_blood');
    }
    
    // Speedester
    if (gameTime && gameTime < 10) {
        unlockAchievement('speedester');
    }
    
    // Machine breaker
    if (!isPvP && aiDifficulty === 'impossible' && currentPlayer === 'X') {
        unlockAchievement('machine_breaker');
    }
    
    // Invincible
    if (consecutiveWins >= 5) {
        unlockAchievement('invincible');
    }
    
    // Draw master
    if (scores.draws >= 3) {
        unlockAchievement('draw_master');
    }
    
    // player
    if (gamesPlayed >= 20) {
        unlockAchievement('player');
    }
}

function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;
    
    achievement.unlocked = true;
    saveAchievements();
    showAchievementToast(achievement);
    renderAchievements();
}

function showAchievementToast(achievement) {
    toastMessage.textContent = achievement.title;
    achievementToast.classList.add('show');
    playSound('achievement');
    
    setTimeout(() => {
        achievementToast.classList.remove('show');
    }, 3000);
}

function renderAchievements() {
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        item.innerHTML = `
            <div class="achievement-icon">${achievement.unlocked ? achievement.title.split(' ')[0] : '🔒'}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.unlocked ? achievement.title : '???'}</div>
                <div class="achievement-description">${achievement.unlocked ? achievement.description : 'Locked'}</div>
            </div>
        `;
        
        achievementsList.appendChild(item);
    });
}

function saveAchievements() {
    const achievementData = achievements.map(a => ({ id: a.id, unlocked: a.unlocked }));
    localStorage.setItem('achievements', JSON.stringify(achievementData));
}

function loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
        const data = JSON.parse(saved);
        data.forEach(saved => {
            const achievement = achievements.find(a => a.id === saved.id);
            if (achievement) {
                achievement.unlocked = saved.unlocked;
            }
        });
    }
}

 
// HISTORY TRACKING
 

function addMoveToHistory(index) {
    const positions = [
        'Top Left', 'Top Center', 'Top Right',
        'Middle Left', 'Center', 'Middle Right',
        'Bottom Left', 'Bottom Center', 'Bottom Right'
    ];
    
    const playerName = currentPlayer === "X" ? p1Input.value : p2Input.value;
    const symbol = skins[currentSkin][currentPlayer.toLowerCase()];
    
    moveHistory.push({
        player: currentPlayer,
        playerName,
        symbol,
        position: positions[index],
        index,
        moveNumber: moveHistory.length + 1
    });
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (moveHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No moves yet. Start playing!</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    moveHistory.forEach((move, i) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-item-header">
                <span>#${move.moveNumber}</span>
                <span>${move.playerName}</span>
            </div>
            <div class="history-item-move ${move.player.toLowerCase()}">
                ${move.symbol} → ${move.position}
            </div>
        `;
        historyList.appendChild(item);
    });
    
    // Scroll to bottom
    historyList.scrollTop = historyList.scrollHeight;
}

function toggleHistorySidebar() {
    historySidebar.classList.toggle('open');
}

 
// UNDO FUNCTIONALITY
 

function saveHistory() {
    boardHistory.push([...board]);
    playerHistory.push(currentPlayer);
}

function undoMove() {
    if (boardHistory.length <= 1 || !running) return;
    
    // Remove current state
    boardHistory.pop();
    playerHistory.pop();
    
    // Remove last move from history
    if (moveHistory.length > 0) {
        moveHistory.pop();
        updateHistoryDisplay();
    }
    
    // Restore previous state
    board = [...boardHistory[boardHistory.length - 1]];
    currentPlayer = playerHistory[playerHistory.length - 1];
    
    // Update board display
    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
        
        if (board[index] !== "") {
            cell.textContent = skins[currentSkin][board[index].toLowerCase()];
            cell.classList.add(board[index].toLowerCase());
        }
    });
    
    updateStatus();
    playSound('click');
}

 
// TURN TIMER
 

function startTurnTimer() {
    if (!timerEnabled) return;
    
    stopTurnTimer();
    timerStartTime = Date.now();
    timerFill.style.width = '100%';
    timerFill.classList.remove('warning', 'danger');
    
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - timerStartTime;
        const remaining = timerDuration - elapsed;
        const percentage = (remaining / timerDuration) * 100;
        
        timerFill.style.width = percentage + '%';
        
        if (percentage < 30) {
            timerFill.classList.add('danger');
        } else if (percentage < 50) {
            timerFill.classList.add('warning');
        }
        
        if (remaining <= 0) {
            handleTimerExpired();
        }
    }, 100);
}

function stopTurnTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function handleTimerExpired() {
    stopTurnTimer();
    
    // In PvP, the current player loses their turn
    // In AI mode, auto-play a random move
    if (!isPvP && currentPlayer === "O") {
        aiMove();
    } else {
        changePlayer();
        playSound('click');
    }
}

 
// RESET & RESTART
 

function restartRound() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    gameStartTime = Date.now();
    winningLine.style.width = "0";
    moveHistory = [];
    boardHistory = [];
    playerHistory = [];
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
    
    updateStatus();
    updateHistoryDisplay();
    saveHistory();
    
    if (timerEnabled) {
        startTurnTimer();
    }
}

function resetScores() {
    if (!confirm('Are you sure you want to reset all statistics?')) return;
    
    scores = { X: 0, O: 0, draws: 0 };
    consecutiveWins = 0;
    lastWinner = null;
    gamesPlayed = 0;
    saveSettings();
    updateScoreDisplay();
    playSound('click');
}

function resetGameFull() {
    resetScores();
    tournamentWins = { X: 0, O: 0 };
    updateTournamentDisplay();
    restartRound();
}

 
// VISUAL EFFECTS
 

function drawWinningLine(combo) {
    const cell0 = cells[combo[0]];
    const cell2 = cells[combo[2]];
    const startRect = cell0.getBoundingClientRect();
    const endRect = cell2.getBoundingClientRect();
    const boardRect = document.querySelector('.game-wrapper').getBoundingClientRect();
    
    // Calculate center points relative to the game wrapper
    const x1 = startRect.left + startRect.width / 2 - boardRect.left;
    const y1 = startRect.top + startRect.height / 2 - boardRect.top;
    const x2 = endRect.left + endRect.width / 2 - boardRect.left;
    const y2 = endRect.top + endRect.height / 2 - boardRect.top;

    // Calculate distance and angle
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angleRad = Math.atan2(y2 - y1, x2 - x1);
    const angleDeg = angleRad * 180 / Math.PI;
    
    // Extension to make the line go slightly beyond cells
    const extension = startRect.width / 3;
    const newLength = distance + (extension * 2);

    // Calculate starting position (with extension backwards)
    const xStart = x1 - extension * Math.cos(angleRad);
    const yStart = y1 - extension * Math.sin(angleRad);
    
    // Center the line vertically (account for line height)
    const lineHeight = 8; // Match CSS height
    const yFinal = yStart - (lineHeight / 2);

    updateWinningLineColor();
    
    // Reset and position the line
    winningLine.style.width = '0px';
    winningLine.style.transition = 'none';
    winningLine.style.transform = `translate(${xStart}px, ${yFinal}px) rotate(${angleDeg}deg)`;
    winningLine.style.display = 'block';

    // Force reflow
    void winningLine.offsetWidth;

    // Animate the line
    winningLine.style.transition = 'width 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    winningLine.style.width = `${newLength}px`;
}

// Add window resize handler to redraw winning line if game is won
window.addEventListener('resize', () => {
    if (!running && winningLine.style.width !== '0px' && winningLine.style.width !== '') {
        // Find which combo won
        for (let condition of winConditions) {
            if (board[condition[0]] && 
                board[condition[0]] === board[condition[1]] && 
                board[condition[0]] === board[condition[2]]) {
                drawWinningLine(condition);
                break;
            }
        }
    }
});

function createParticles() {
    const rootStyles = getComputedStyle(document.body);
    const colorX = rootStyles.getPropertyValue('--highlight-x');
    const colorO = rootStyles.getPropertyValue('--highlight-o');

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);
        
        const x = Math.random() * window.innerWidth;
        particle.style.left = `${x}px`;
        particle.style.top = `-10px`;
        particle.style.backgroundColor = Math.random() > 0.5 ? colorX : colorO;
        particle.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        document.body.appendChild(confetti);
        
        const x = Math.random() * window.innerWidth;
        confetti.style.left = `${x}px`;
        confetti.style.top = `-20px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

 
// AUDIO
 

function playSound(type) {
    if (isMuted) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    switch(type) {
        case 'click':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
            
        case 'win':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
            break;
            
        case 'draw':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
            
        case 'achievement':
            osc.type = 'square';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;
    }
}

 
// GAME MODE CONTROLS
 

function toggleGameMode() {
    isPvP = !isPvP;
    
    if (isPvP) {
        modeBtn.innerHTML = '<span class="btn-icon">👥</span> PvP';
        modeBtn.classList.remove('active');
        aiDifficultyContainer.style.display = 'none';
        p2Input.value = "Player 2";
        p2Input.disabled = false;
    } else {
        modeBtn.innerHTML = '<span class="btn-icon">🤖</span> vs AI';
        modeBtn.classList.add('active');
        aiDifficultyContainer.style.display = 'flex';
        p2Input.value = "Computer";
        p2Input.disabled = true;
    }
    
    restartRound();
}

 
// SHARE FUNCTIONALITY
 

function shareResult() {
    const totalGames = scores.X + scores.O + scores.draws;
    const p1Name = p1Input.value;
    const p2Name = p2Input.value;
    
    const message = `🎮 Tic-Tac-Toe Results 🎮\n\n` +
        `${p1Name} (X): ${scores.X} wins\n` +
        `${p2Name} (O): ${scores.O} wins\n` +
        `Draws: ${scores.draws}\n` +
        `Total Games: ${totalGames}\n\n` +
        `Can you beat my score? Play now!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Tic-Tac-Toe Results',
            text: message
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            alert(message);
        });
    }
    
    playSound('click');
}

 
// KEYBOARD ACCESSIBILITY
 

function handleKeyboardInput(e) {
    const index = parseInt(this.getAttribute('data-index'));
    
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (board[index] === "" && running) {
            cellClicked.call(this);
        }
    }
    
    // Arrow key navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let newIndex = index;
        
        switch(e.key) {
            case 'ArrowUp': newIndex = index - 3; break;
            case 'ArrowDown': newIndex = index + 3; break;
            case 'ArrowLeft': newIndex = index - 1; break;
            case 'ArrowRight': newIndex = index + 1; break;
        }
        
        if (newIndex >= 0 && newIndex < 9) {
            cells[newIndex].focus();
        }
    }
}

function handleGlobalKeyboard(e) {
    // Enter or Space to continue in modal
    if (modal.classList.contains('show')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnContinue.click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            btnExit.click();
        }
    }
    
    // ESC to close modals
    if (e.key === 'Escape') {
        closeModal(skinsModal);
        closeModal(achievementsModal);
        if (historySidebar.classList.contains('active')) {
            historySidebar.classList.remove('active');
        }
    }
}

 
// MODAL CONTROLS
 

function openModal(modalElement) {
    modalElement.classList.add('show');
}

function closeModal(modalElement) {
    modalElement.classList.remove('show');
}

 
// SCORE DISPLAY
 

function updateScoreDisplay() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDrawEl.textContent = scores.draws;
    
    // Animate score update
    [scoreXEl, scoreOEl, scoreDrawEl].forEach(el => {
        el.parentElement.classList.add('animate');
        setTimeout(() => el.parentElement.classList.remove('animate'), 500);
    });
}

 
// LOCAL STORAGE
 

function saveSettings() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
    localStorage.setItem('consecutiveWins', consecutiveWins);
    localStorage.setItem('lastWinner', lastWinner);
    localStorage.setItem('gamesPlayed', gamesPlayed);
    saveAchievements();
}

function loadSettings() {
    // Load scores
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) scores = JSON.parse(savedScores);
    
    // Load theme
    const savedThemeIndex = localStorage.getItem('ticTacToeThemeIndex');
    if (savedThemeIndex !== null) {
        currentThemeIndex = parseInt(savedThemeIndex);
        document.body.className = themes[currentThemeIndex];
    }
    
    // Load sound/music preferences
    const savedMuted = localStorage.getItem('isMuted');
    if (savedMuted !== null) {
        isMuted = savedMuted === 'true';
        updateSoundIcon();
    }
    
    const savedMusicMuted = localStorage.getItem('isMusicMuted');
    if (savedMusicMuted !== null) {
        isMusicMuted = savedMusicMuted === 'true';
        updateMusicIcon();
    }
    
    // Load AI difficulty
    const savedDifficulty = localStorage.getItem('aiDifficulty');
    if (savedDifficulty) {
        aiDifficulty = savedDifficulty;
        aiDifficultySelect.value = aiDifficulty;
    }
    
    // Load skin
    const savedSkin = localStorage.getItem('currentSkin');
    if (savedSkin && skins[savedSkin]) {
        currentSkin = savedSkin;
        document.querySelector(`[data-skin="${savedSkin}"]`)?.classList.add('selected');
    }
    
    // Load unlocked skins
    const savedUnlockedSkins = localStorage.getItem('unlockedSkins');
    if (savedUnlockedSkins) {
        unlockedSkins = JSON.parse(savedUnlockedSkins);
    }
    
    // Load explored themes
    const savedExploredThemes = localStorage.getItem('exploredThemes');
    if (savedExploredThemes) {
        exploredThemes = JSON.parse(savedExploredThemes);
    }
    
    // Load consecutive wins
    const savedConsecutiveWins = localStorage.getItem('consecutiveWins');
    if (savedConsecutiveWins) {
        consecutiveWins = parseInt(savedConsecutiveWins);
    }
    
    // Load last winner
    const savedLastWinner = localStorage.getItem('lastWinner');
    if (savedLastWinner) {
        lastWinner = savedLastWinner;
    }
    
    // Load games played
    const savedGamesPlayed = localStorage.getItem('gamesPlayed');
    if (savedGamesPlayed) {
        gamesPlayed = parseInt(savedGamesPlayed);
    }
    
    // Load achievements
    loadAchievements();
    
    updateScoreDisplay();
}

 
// INITIALIZATION COMPLETE
 

console.log(' Tic-Tac-Toe Loaded!');
console.log('Features: AI Difficulty, Undo, Sounds, Music, Timer, Achievements, Skins, Tournament Mode, History, Share, Keyboard Controls, Parallax Background');