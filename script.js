document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameArea = document.getElementById('gameArea');
    const pipeTop = document.getElementById('pipeTop');
    const pipeBottom = document.getElementById('pipeBottom');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    
    let birdPosition = 300;
    let birdVelocity = 0;
    let gravity = 0.5;
    let gameSpeed = 2;
    let pipeGap = 200;
    let score = 0;
    let highScore = 0;
    let gameRunning = false;
    let animationId;
    let pipePosition = 400;
    let pipeHeight;
    
    // Start the game
    function startGame() {
        if (gameRunning) return;
        
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = score;
        birdPosition = 300;
        birdVelocity = 0;
        pipePosition = 400;
        
        bird.style.top = birdPosition + 'px';
        startBtn.disabled = true;
        
        // Generate random pipe height
        pipeHeight = Math.floor(Math.random() * 300) + 50;
        pipeTop.style.height = pipeHeight + 'px';
        pipeBottom.style.height = (600 - pipeHeight - pipeGap) + 'px';
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
        if (pipePosition === 100) {
            score++;
            scoreDisplay.textContent = score;
        }
        
        // Reset pipe when it goes off screen
        if (pipePosition < -80) {
            pipePosition = 400;
            pipeHeight = Math.floor(Math.random() * 300) + 50;
            pipeTop.style.height = pipeHeight + 'px';
            pipeBottom.style.height = (600 - pipeHeight - pipeGap) + 'px';
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
        if (birdRect.bottom > gameAreaRect.bottom || birdRect.top < gameAreaRect.top) {
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
        startBtn.disabled = false;
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
        }
        
        alert(`Game Over! Your score: ${score}`);
    }
    
    // Make the bird flap
    function flap() {
        if (!gameRunning) return;
        birdVelocity = -10;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            flap();
        }
    });
    
    gameArea.addEventListener('click', flap);
});
