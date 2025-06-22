// Game State Management
class TypingGame {
    constructor() {
        this.currentWord = '';
        this.score = 0;
        this.time = 60;
        this.totalTime = 60;
        this.isPlaying = false;
        this.isPaused = false;
        this.timer = null;
        this.playerName = 'Player';
        this.difficulty = 'medium';
        this.startTime = null;
        this.totalTyped = 0;
        this.correctWords = 0;
        this.incorrectAttempts = 0;
        this.soundEnabled = true;
        this.currentTheme = 'default';
        this.wordCategory = 'programming';
        
        // Initialize game data
        this.scores = this.loadScores();
        this.settings = this.loadSettings();
        
        this.initializeElements();
        this.bindEvents();
        this.applySettings();
        this.renderScoreboard();
    }

    // Word banks for different categories
    getWordBank() {
        const wordBanks = {
            programming: [
                'javascript','binary tree','linked list','hashmap','queue','stack','data structure','programming', 'developer', 'algorithm', 'function', 'variable',
                'async','API', 'REST', 'GraphQL','await', 'promise', 'react', 'angular', 'vue', 'database', 'Syntax Error SUCKS','server',
                'client', 'internet', 'browser', 'console', 'syntax', 'framework', 'library','GCET Coding',
                'iteration', 'recursion', 'object', 'closure', 'callback', 'prototype','GITHUB is Pain In The Ass',
                'expression', 'statement', 'operator', 'component', 'interface', 'inheritance',
                'polymorphism', 'encapsulation', 'abstraction', 'debugging', 'testing'
            ],
            common: [
                'apple', 'banana','Venky Mama' ,'cherry', 'Orange Movie is So Goood', 'grape', 'lemon', 'peach', 'plum',
                'berry', 'Modi and meloni', 'Dr.House', 'garden', 'flower', 'river', 'mountain', 'ocean','Niko Bellic',
                'forest', 'desert','GTA 6 Is comming soon ' ,'valley', 'bridge', 'castle', 'village', 'market', 'school',
                'library', 'hospital', 'restaurant', 'theater', 'museum', 'gallery', 'station',
                'airport', 'highway', 'Rebel Star','tunnel', 'building', 'window', 'camera','Incognito' ,'blue picture'
            ],
            mixed: [
                'adventure', 'beautiful', 'challenge', 'discovery', 'elephant','Hasta La Vista Baby' ,'fantastic','Rajumouli #SSMB When?',
                'gorgeous Baby', 'happiness', 'I Love You','Jonny Sins','incredible', 'journey', 'knowledge is Wine', 'landscape',
                'magnificent','Situationship Whats That?' ,'notebook', 'opportunity', 'paradise', 'question', 'rainbow',
                'sunshine', 'telephone', 'umbrella', 'vacation', 'wonderful', 'excellent','Meow',
                'yesterday', 'zebra', 'quantum', 'universe', 'galaxy', 'planet', 'asteroid'
            ]
        };
        return wordBanks[this.wordCategory] || wordBanks.programming;
    }

    // Initialize DOM elements
    initializeElements() {
        // Sections
        this.sections = {
            menu: document.getElementById('menu'),
            playerName: document.getElementById('player-name-section'),
            game: document.getElementById('game'),
            gameOver: document.getElementById('game-over'),
            scoreboard: document.getElementById('scoreboard-section'),
            settings: document.getElementById('settings-section')
        };

        // Game elements
        this.elements = {
            playerNameInput: document.getElementById('player-name'),
            difficultySelect: document.getElementById('difficulty'),
            wordDisplay: document.getElementById('word-display'),
            wordInput: document.getElementById('word-input'),
            feedback: document.getElementById('feedback'),
            timeDisplay: document.getElementById('time'),
            scoreDisplay: document.getElementById('score'),
            wpmDisplay: document.getElementById('wpm'),
            currentPlayerName: document.getElementById('current-player-name'),
            finalScore: document.getElementById('final-score'),
            finalWpm: document.getElementById('final-wpm'),
            finalAccuracy: document.getElementById('final-accuracy'),
            scoreboardList: document.getElementById('scoreboard-list'),
            progressFill: document.getElementById('progress-fill'),
            soundToggle: document.getElementById('sound-toggle'),
            themeSelector: document.getElementById('theme-selector'),
            wordCategorySelect: document.getElementById('word-category')
        };

        // Buttons
        this.buttons = {
            play: document.getElementById('play-btn'),
            scoreboard: document.getElementById('scoreboard-btn'),
            settings: document.getElementById('settings-btn'),
            exit: document.getElementById('exit-btn'),
            startGame: document.getElementById('start-game-btn'),
            backToMenu: document.getElementById('back-to-menu-btn'),
            playAgain: document.getElementById('play-again-btn'),
            menuAfterGame: document.getElementById('menu-after-game-btn'),
            menuFromScoreboard: document.getElementById('menu-from-scoreboard-btn'),
            menuFromSettings: document.getElementById('menu-from-settings-btn'),
            clearScores: document.getElementById('clear-scores-btn'),
            pause: document.getElementById('pause-btn')
        };
    }

    // Bind event listeners
    bindEvents() {
        // Navigation buttons
        this.buttons.play.addEventListener('click', () => this.showPlayerNameInput());
        this.buttons.scoreboard.addEventListener('click', () => this.showScoreboard());
        this.buttons.settings.addEventListener('click', () => this.showSettings());
        this.buttons.exit.addEventListener('click', () => this.exitGame());
        
        // Game flow buttons
        this.buttons.startGame.addEventListener('click', () => this.startGame());
        this.buttons.backToMenu.addEventListener('click', () => this.showMenu());
        this.buttons.playAgain.addEventListener('click', () => this.restartGame());
        this.buttons.menuAfterGame.addEventListener('click', () => this.showMenu());
        this.buttons.menuFromScoreboard.addEventListener('click', () => this.showMenu());
        this.buttons.menuFromSettings.addEventListener('click', () => this.showMenu());
        this.buttons.clearScores.addEventListener('click', () => this.clearScores());
        this.buttons.pause.addEventListener('click', () => this.togglePause());

        // Game input
        this.elements.wordInput.addEventListener('input', () => this.checkWord());
        this.elements.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // Settings
        this.elements.soundToggle.addEventListener('change', () => this.updateSettings());
        this.elements.themeSelector.addEventListener('change', () => this.updateSettings());
        this.elements.wordCategorySelect.addEventListener('change', () => this.updateSettings());

        // Tab buttons for scoreboard
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPlaying) {
                this.togglePause();
            }
        });
    }

    // Settings management
    loadSettings() {
        const defaultSettings = {
            soundEnabled: true,
            theme: 'default',
            wordCategory: 'programming'
        };
        return JSON.parse(localStorage.getItem('typing-settings')) || defaultSettings;
    }

    saveSettings() {
        const settings = {
            soundEnabled: this.soundEnabled,
            theme: this.currentTheme,
            wordCategory: this.wordCategory
        };
        localStorage.setItem('typing-settings', JSON.stringify(settings));
    }

    applySettings() {
        const settings = this.loadSettings();
        this.soundEnabled = settings.soundEnabled;
        this.currentTheme = settings.theme;
        this.wordCategory = settings.wordCategory;

        this.elements.soundToggle.checked = this.soundEnabled;
        this.elements.themeSelector.value = this.currentTheme;
        this.elements.wordCategorySelect.value = this.wordCategory;

        this.applyTheme();
    }

    updateSettings() {
        this.soundEnabled = this.elements.soundToggle.checked;
        this.currentTheme = this.elements.themeSelector.value;
        this.wordCategory = this.elements.wordCategorySelect.value;
        
        this.applyTheme();
        this.saveSettings();
    }

    applyTheme() {
        document.body.className = this.currentTheme === 'default' ? '' : `${this.currentTheme}-theme`;
    }

    // Score management
    loadScores() {
        return JSON.parse(localStorage.getItem('typing-scores')) || [];
    }

    saveScores() {
        localStorage.setItem('typing-scores', JSON.stringify(this.scores));
    }

    clearScores() {
        if (confirm('Are you sure you want to clear all scores?')) {
            this.scores = [];
            this.saveScores();
            this.renderScoreboard();
            this.playSound('error');
        }
    }

    // Navigation functions
    showSection(sectionName) {
        Object.values(this.sections).forEach(section => {
            section.classList.remove('active');
        });
        this.sections[sectionName].classList.add('active');
        
        // Clear input and feedback when switching sections
        if (this.elements.wordInput) {
            this.elements.wordInput.value = '';
        }
        if (this.elements.feedback) {
            this.elements.feedback.textContent = '';
        }
    }

    showMenu() {
        this.showSection('menu');
        this.resetGame();
    }

    showPlayerNameInput() {
        this.showSection('playerName');
        this.elements.playerNameInput.value = '';
        this.elements.playerNameInput.focus();
    }

    showGame() {
        this.showSection('game');
        this.elements.wordInput.focus();
    }

    showGameOver() {
        this.showSection('gameOver');
        this.displayFinalStats();
    }

    showScoreboard() {
        this.showSection('scoreboard');
        this.renderScoreboard();
    }

    showSettings() {
        this.showSection('settings');
    }

    // Game logic
    startGame() {
        this.playerName = this.elements.playerNameInput.value.trim() || 'Anonymous Player';
        this.difficulty = this.elements.difficultySelect.value;
        
        // Set time based on difficulty
        const timeMap = { easy: 90, medium: 60, hard: 30 };
        this.time = timeMap[this.difficulty];
        this.totalTime = this.time;
        
        this.resetGameStats();
        this.elements.currentPlayerName.textContent = this.playerName;
        
        this.showGame();
        this.isPlaying = true;
        this.startTime = Date.now();
        this.startTimer();
        this.showNewWord();
        this.playSound('start');
    }

    resetGame() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetGameStats() {
        this.score = 0;
        this.totalTyped = 0;
        this.correctWords = 0;
        this.incorrectAttempts = 0;
        this.updateDisplay();
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.time--;
                this.updateDisplay();
                
                if (this.time <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        const pauseBtn = this.buttons.pause;
        
        if (this.isPaused) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.elements.wordDisplay.textContent = 'PAUSED';
            this.elements.wordInput.disabled = true;
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.elements.wordDisplay.textContent = this.currentWord;
            this.elements.wordInput.disabled = false;
            this.elements.wordInput.focus();
        }
        
        this.playSound('click');
    }

    showNewWord() {
        const words = this.getWordBank();
        const randomIndex = Math.floor(Math.random() * words.length);
        this.currentWord = words[randomIndex];
        this.elements.wordDisplay.textContent = this.currentWord;
        this.updateProgress();
    }

    checkWord() {
        if (!this.isPlaying || this.isPaused) return;
        
        const inputValue = this.elements.wordInput.value.trim();
        
        if (inputValue.toLowerCase() === this.currentWord.toLowerCase()) {
            this.handleCorrectWord();
        } else if (inputValue.length >= this.currentWord.length) {
            this.handleIncorrectWord();
        }
    }

    handleCorrectWord() {
        this.score++;
        this.correctWords++;
        this.totalTyped++;
        
        this.showFeedback('Excellent! 🎉', 'correct');
        this.playSound('success');
        
        this.elements.wordInput.value = '';
        this.updateDisplay();
        this.showNewWord();
    }

    handleIncorrectWord() {
        this.incorrectAttempts++;
        this.totalTyped++;
        
        this.showFeedback('Bruhh Try again ! 💪', 'incorrect');
        this.playSound('error');
        
        this.elements.wordInput.value = '';
    }

    showFeedback(message, type) {
        this.elements.feedback.textContent = message;
        this.elements.feedback.className = `feedback ${type}`;
        
        setTimeout(() => {
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'feedback';
        }, 1500);
    }

    updateDisplay() {
        this.elements.scoreDisplay.textContent = this.score;
        this.elements.timeDisplay.textContent = this.time;
        
        // Calculate WPM
        const elapsedMinutes = (this.totalTime - this.time) / 60;
        const wpm = elapsedMinutes > 0 ? Math.round(this.correctWords / elapsedMinutes) : 0;
        this.elements.wpmDisplay.textContent = wpm;
    }

    updateProgress() {
        const progress = ((this.totalTime - this.time) / this.totalTime) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        
        // Calculate final stats
        const elapsedMinutes = this.totalTime / 60;
        const wpm = Math.round(this.correctWords / elapsedMinutes);
        const accuracy = this.totalTyped > 0 ? Math.round((this.correctWords / this.totalTyped) * 100) : 0;
        
        // Save score
        const gameScore = {
            name: this.playerName,
            score: this.score,
            wpm: wpm,
            accuracy: accuracy,
            difficulty: this.difficulty,
            date: new Date().toISOString(),
            category: this.wordCategory
        };
        
        this.scores.push(gameScore);
        this.scores.sort((a, b) => b.score - a.score);
        
        // Keep only top 100 scores
        if (this.scores.length > 100) {
            this.scores = this.scores.slice(0, 100);
        }
        
        this.saveScores();
        this.showGameOver();
        this.playSound('gameOver');
    }

    displayFinalStats() {
        const elapsedMinutes = this.totalTime / 60;
        const wpm = Math.round(this.correctWords / elapsedMinutes);
        const accuracy = this.totalTyped > 0 ? Math.round((this.correctWords / this.totalTyped) * 100) : 0;
        
        this.elements.finalScore.textContent = this.score;
        this.elements.finalWpm.textContent = wpm;
        this.elements.finalAccuracy.textContent = accuracy;
    }

    restartGame() {
        this.resetGame();
        this.showPlayerNameInput();
    }

    // Scoreboard management
    renderScoreboard(filter = 'all') {
        let filteredScores = [...this.scores];
        
        if (filter === 'today') {
            const today = new Date().toDateString();
            filteredScores = this.scores.filter(score => 
                new Date(score.date).toDateString() === today
            );
        }
        
        this.elements.scoreboardList.innerHTML = '';
        
        if (filteredScores.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'scoreboard-item';
            emptyMessage.innerHTML = `
                <span>No scores yet. Be the first to play! 🚀</span>
                <span></span>
            `;
            this.elements.scoreboardList.appendChild(emptyMessage);
            return;
        }
        
        filteredScores.slice(0, 10).forEach((playerScore, index) => {
            const item = document.createElement('div');
            item.className = 'scoreboard-item';
            
            const rankIcon = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            const difficultyBadge = this.getDifficultyBadge(playerScore.difficulty);
            
            item.innerHTML = `
                <span>${rankIcon} ${playerScore.name} ${difficultyBadge}</span>
                <div style="text-align: right;">
                    <div>${playerScore.score} words</div>
                    <div style="font-size: 0.8em; opacity: 0.7;">${playerScore.wpm} WPM • ${playerScore.accuracy}%</div>
                </div>
            `;
            this.elements.scoreboardList.appendChild(item);
        });
    }

    getDifficultyBadge(difficulty) {
        const badges = {
            easy: '<span style="background: #10b981; padding: 2px 6px; border-radius: 4px; font-size: 0.7em;">EASY</span>',
            medium: '<span style="background: #f59e0b; padding: 2px 6px; border-radius: 4px; font-size: 0.7em;">MEDIUM</span>',
            hard: '<span style="background: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 0.7em;">HARD</span>'
        };
        return badges[difficulty] || '';
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.renderScoreboard(tab);
    }

    // Sound effects
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const sounds = {
                success: { frequency: 800, duration: 200 },
                error: { frequency: 300, duration: 300 },
                click: { frequency: 600, duration: 100 },
                start: { frequency: 440, duration: 500 },
                gameOver: { frequency: 220, duration: 1000 }
            };
            
            const sound = sounds[type] || sounds.click;
            
            oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + sound.duration / 1000);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    exitGame() {
        if (confirm('Are you sure you want to exit the game?')) {
            window.close();
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.typingGame = new TypingGame();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add particle effects on correct words
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #10b981, #06b6d4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Add CSS for particle animation
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particle {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * -200 - 50}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Enhanced word input effects
    const wordInput = document.getElementById('word-input');
    if (wordInput) {
        wordInput.addEventListener('input', (e) => {
            if (window.typingGame && window.typingGame.isPlaying) {
                const rect = wordInput.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top;
                
                // Create particles on typing
                if (Math.random() > 0.7) {
                    createParticle(x, y);
                }
            }
        });
    }
});
