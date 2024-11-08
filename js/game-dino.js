const dino = document.querySelector('.dino')
const kaktus = document.querySelector('.kaktus')
const button = document.querySelector('button')
const scoreElement = document.querySelector('#score')
const highScoreElement = document.querySelector('#highScore')
const loadingScreen = document.querySelector('.loading-screen')

let score = 0
let highScore = localStorage.getItem('highScore') || 0
let isPlaying = false
let gameLoop
let isJumping = false

highScoreElement.textContent = highScore

window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0'
        setTimeout(() => {
            loadingScreen.style.display = 'none'
        }, 500)
    }, 1000)
})

function startGame() {
    if (isPlaying) return
    
    isPlaying = true
    score = 0
    scoreElement.textContent = score
    kaktus.style.animationPlayState = 'running'
    button.style.display = 'none'
    
    gameLoop = setInterval(() => {
        if (isPlaying) {
            score++
            scoreElement.textContent = score
        }
    }, 100)
}

button.addEventListener('click', startGame)

function jump() {
    if (isJumping || !isPlaying) return
    
    isJumping = true
    dino.style.bottom = '170px'
    
    setTimeout(() => {
        dino.style.bottom = '20px'
        isJumping = false
    }, 600)
}

window.addEventListener('click', jump)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault()
        jump()
    }
})

function gameOver() {
    isPlaying = false
    clearInterval(gameLoop)
    kaktus.style.animationPlayState = 'paused'
    
    const scoreContainer = document.querySelector('.score-container')
    scoreContainer.style.display = 'none'
    
    if (score > highScore) {
        highScore = score
        localStorage.setItem('highScore', highScore)
        highScoreElement.textContent = highScore
    }
    
    const gameOverDiv = document.createElement('div')
    gameOverDiv.style.position = 'fixed'
    gameOverDiv.style.top = '50%'
    gameOverDiv.style.left = '50%'
    gameOverDiv.style.transform = 'translate(-50%, -50%)'
    gameOverDiv.style.textAlign = 'center'
    gameOverDiv.style.zIndex = '1000'
    gameOverDiv.style.fontFamily = "'Press Start 2P', cursive"
    
    gameOverDiv.innerHTML = `
        <h1 style="color: #FF0000; margin-bottom: 20px;">GAME OVER</h1>
        <p style="color: #333; margin-bottom: 10px;">Score: ${score}</p>
        <p style="color: #333; margin-bottom: 20px;">High Score: ${highScore}</p>
        <button 
            onclick="location.reload()" 
            style="
                padding: 12px 24px;
                font-size: 20px;
                border: none;
                border-radius: 25px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
                font-family: 'Press Start 2P', cursive;
            "
            onmouseover="this.style.background='#45a049'; this.style.boxShadow='0 6px 12px rgba(0,0,0,0.2)'; this.style.transform='translateY(-2px)'"
            onmouseout="this.style.background='#4CAF50'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'; this.style.transform='translateY(0)'"
        >
            Play Again
        </button>
    `
    
    document.body.appendChild(gameOverDiv)
}

setInterval(() => {
    if (!isPlaying) return
    
    const dinoBound = dino.getBoundingClientRect()
    const kaktusBound = kaktus.getBoundingClientRect()
    
    const leftJump = dinoBound.right - 10 >= kaktusBound.left
    const rightJump = dinoBound.left + 20 <= kaktusBound.right
    const topJump = dinoBound.bottom >= kaktusBound.top
    
    if (leftJump && rightJump && topJump) {
        gameOver()
    }
}, 100)

let difficulty = 1
setInterval(() => {
    if (isPlaying) {
        difficulty += 0.1
        const newDuration = Math.max(3 - (difficulty * 0.1), 1)
        kaktus.style.animationDuration = `${newDuration}s`
    }
}, 5000)

