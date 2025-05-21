document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameArea = document.getElementById('gameArea');
    const pipeTop = document.getElementById('pipeTop');
    const pipeBottom = document.getElementById('pipeBottom');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreDisplay = document.getElementById('final-score');
    const finalHighScoreDisplay = document.getElementById('final-high-score');
    
    // Game variables
    let birdPosition = 50;
    let birdVelocity = 0;
    let gravity = 0.4;
    let gameSpeed = 3;
    let pipeGap = 250; // Increased gap for easier gameplay
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    let gameRunning = false;
    let animationId;
    let pipePosition = window.innerWidth;
    let pipeHeight;
    let gameAreaHeight = window.innerHeight;
    let gameAreaWidth = window.innerWidth;
    
    // Initialize display
    highScoreDisplay.textContent = highScore;
    
    // Start the game
    function startGame() {
        if (gameRunning) return;
        
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = score;
        birdPosition = gameAreaHeight / 2;
        birdVelocity = 0;
        pipePosition = gameAreaWidth;
        
        bird.style.top = birdPosition + 'px';
        bird.classList.remove('flap');
        
        // Generate random pipe height with buffer from top/bottom
        const minHeight = gameAreaHeight * 0.2;
        const maxHeight = gameAreaHeight * 0.7;
        pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
        
        pipeTop.style.height = pipeHeight + 'px';
        pipeBottom.style.height = (gameAreaHeight - pipeHeight - pipeGap - 80) + 'px';
        pipeTop.style.left = pipePosition + 'px';
        pipeBottom.style.left = pipePosition + 'px';
        
        // Start game loop
        gameLoop();
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Update bird position
        birdVelocity += gravity;
        birdPosition += birdVelocity;
        bird.style.top = birdPosition + 'px';
        
        // Rotate bird based on velocity
        const rotation = Math.min(Math.max(birdVelocity * 3, -20), 60);
        bird.style.transform = `rotate(${rotation}deg)`;
        
        // Update pipe position
        pipePosition -= gameSpeed;
        pipeTop.style.left = pipePosition + 'px';
        pipeBottom.style.left = pipePosition + 'px';
        
        // Check for collisions
        if (checkCollision()) {
            endGame();
            return;
        }
        
        // Check if bird passed the pipe
        if (pipePosition + 80 === Math.floor(gameAreaWidth / 2)) {
            score++;
            scoreDisplay.textContent = score;
            // Slightly increase speed as score increases
            gameSpeed = 3 + Math.floor(score / 5) * 0.2;
        }
        
        // Reset pipe when it goes off screen
        if (pipePosition < -80) {
            pipePosition = gameAreaWidth;
            pipeHeight = Math.floor(Math.random() * (gameAreaHeight * 0.6)) + (gameAreaHeight * 0.2);
            pipeTop.style.height = pipeHeight + 'px';
            pipeBottom.style.height = (gameAreaHeight - pipeHeight - pipeGap - 80) + 'px';
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Check for collisions
    function checkCollision() {
        const birdRect = bird.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        const pipeTopRect = pipeTop.getBoundingClientRect();
        const pipeBottomRect = pipeBottom.getBoundingClientRect();
        
        // Check if bird hits ground or ceiling
        if (birdRect.bottom > gameAreaRect.bottom - 80 || birdRect.top < gameAreaRect.top) {
            return true;
        }
        
        // Check if bird hits pipes
        if (birdRect.right > pipeTopRect.left && 
            birdRect.left < pipeTopRect.right && 
            (birdRect.top < pipeTopRect.bottom || birdRect.bottom > pipeBottomRect.top)) {
            return true;
        }
        
        return false;
    }
    
    // End the game
    function endGame() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('flappyHighScore', highScore);
        }
        
        // Show game over screen
        finalScoreDisplay.textContent = score;
        finalHighScoreDisplay.textContent = highScore;
        gameOverScreen.style.display = 'flex';
    }
    
    // Make the bird flap
    function flap() {
        if (!gameRunning) return;
        birdVelocity = -8;
        bird.classList.add('flap');
        setTimeout(() => bird.classList.remove('flap'), 200);
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!gameRunning && startScreen.style.display !== 'none') {
                startGame();
            } else {
                flap();
            }
        }
    });
    
    gameArea.addEventListener('click', (e) => {
        if (!gameRunning && startScreen.style.display !== 'none') {
            startGame();
        } else {
            flap();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        gameAreaHeight = window.innerHeight;
        gameAreaWidth = window.innerWidth;
    });
});
