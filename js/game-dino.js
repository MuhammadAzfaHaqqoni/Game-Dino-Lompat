const dino = document.querySelector('.dino')                  // Mengambil elemen dino dari DOM
const kaktus = document.querySelector('.kaktus')             // Mengambil elemen kaktus dari DOM
const button = document.querySelector('button')              // Mengambil elemen button dari DOM
const scoreElement = document.querySelector('#score')        // Mengambil elemen score dari DOM
const highScoreElement = document.querySelector('#highScore')// Mengambil elemen highscore dari DOM
const loadingScreen = document.querySelector('.loading-screen') // Mengambil elemen loading screen dari DOM

let score = 0                                               // Inisialisasi nilai score awal
let highScore = localStorage.getItem('highScore') || 0      // Mengambil highscore dari localStorage atau set 0
let isPlaying = false                                       // Status permainan sedang berjalan atau tidak
let gameLoop                                                // Variable untuk menyimpan interval game loop
let isJumping = false                                       // Status dino sedang melompat atau tidak

highScoreElement.textContent = highScore                    // Menampilkan highscore ke dalam elemen

// Loading screen handler
document.addEventListener('DOMContentLoaded', function() {   // Event listener saat DOM selesai dimuat
    const loadingScreen = document.getElementById('load');   // Mengambil elemen loading screen
    const container = document.querySelector('.container');  // Mengambil elemen container game
    
    // Sembunyikan container saat loading
    container.style.display = 'none';                       // Menyembunyikan container game
    
    // Tunggu semua aset dimuat
    window.addEventListener('load', function() {             // Event listener saat semua aset dimuat
        setTimeout(function() {                              // Delay sebelum menampilkan game
            loadingScreen.classList.add('hide-loading');     // Menambahkan class untuk animasi fade out
            container.style.display = 'flex';                // Menampilkan container game
            
            // Hapus loading screen dari DOM setelah animasi selesai
            setTimeout(() => {
                loadingScreen.remove();                      // Menghapus loading screen dari DOM
            }, 500);
        }, 2000);
    });
});

function startGame() {                                       // Fungsi untuk memulai permainan
    if (isPlaying) return                                   // Cek jika game sudah berjalan
    
    isPlaying = true                                        // Set status permainan menjadi aktif
    score = 0                                               // Reset score ke 0
    scoreElement.textContent = score                        // Update tampilan score
    kaktus.style.animationPlayState = 'running'            // Mulai animasi kaktus
    button.style.display = 'none'                          // Sembunyikan tombol start
    
    gameLoop = setInterval(() => {                         // Mulai game loop untuk update score
        if (isPlaying) {
            score++                                        // Increment score
            scoreElement.textContent = score               // Update tampilan score
        }
    }, 100)
}

button.addEventListener('click', startGame)                 // Event listener untuk tombol start

function jump() {                                          // Fungsi untuk melompat
    if (isJumping || !isPlaying) return                   // Cek jika sedang melompat atau game belum mulai
    
    isJumping = true                                      // Set status melompat
    dino.style.bottom = '170px'                          // Mengubah posisi dino ke atas
    
    setTimeout(() => {                                    // Timer untuk kembali ke posisi awal
        dino.style.bottom = '20px'                       // Mengembalikan posisi dino
        isJumping = false                                // Reset status melompat
    }, 600)
}

window.addEventListener('click', jump)                    // Event listener untuk klik mouse
document.addEventListener('keydown', (e) => {             // Event listener untuk keyboard
    if (e.code === 'Space') {                            // Cek jika tombol spasi ditekan
        e.preventDefault()                                // Mencegah scroll halaman
        jump()                                           // Panggil fungsi lompat
    }
})

function gameOver() {                                     // Fungsi saat game berakhir
    isPlaying = false                                    // Set status permainan menjadi selesai
    clearInterval(gameLoop)                              // Hentikan game loop
    kaktus.style.animationPlayState = 'paused'          // Hentikan animasi kaktus
    
    const scoreContainer = document.querySelector('.score-container') // Ambil container score
    scoreContainer.style.display = 'none'                // Sembunyikan container score
    
    if (score > highScore) {                            // Cek jika score melebihi highscore
        highScore = score                               // Update highscore
        localStorage.setItem('highScore', highScore)    // Simpan highscore ke localStorage
        highScoreElement.textContent = highScore        // Update tampilan highscore
    }
    
    const gameOverDiv = document.createElement('div')    // Buat elemen div untuk game over
    gameOverDiv.style.position = 'fixed'                // Set posisi fixed
    gameOverDiv.style.top = '50%'                       // Posisi vertical tengah
    gameOverDiv.style.left = '50%'                      // Posisi horizontal tengah
    gameOverDiv.style.transform = 'translate(-50%, -50%)' // Centering sempurna
    gameOverDiv.style.textAlign = 'center'              // Rata tengah teks
    gameOverDiv.style.zIndex = '1000'                   // Layer paling atas
    gameOverDiv.style.fontFamily = "'Press Start 2P', cursive" // Set font game
    
    gameOverDiv.innerHTML = `                           // Set konten HTML game over screen
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
    
    document.body.appendChild(gameOverDiv)               // Tambahkan elemen game over ke DOM
}

setInterval(() => {                                      // Interval untuk deteksi tabrakan
    if (!isPlaying) return                              // Cek jika game sedang berjalan
    
    const dinoBound = dino.getBoundingClientRect()      // Ambil posisi dan ukuran dino
    const kaktusBound = kaktus.getBoundingClientRect()  // Ambil posisi dan ukuran kaktus
    
    const leftJump = dinoBound.right - 10 >= kaktusBound.left   // Cek tabrakan dari kiri
    const rightJump = dinoBound.left + 20 <= kaktusBound.right  // Cek tabrakan dari kanan
    const topJump = dinoBound.bottom >= kaktusBound.top         // Cek tabrakan dari atas
    
    if (leftJump && rightJump && topJump) {             // Jika terjadi tabrakan
        gameOver()                                      // Panggil fungsi game over
    }
}, 100)

let difficulty = 1                                       // Inisialisasi tingkat kesulitan
setInterval(() => {                                     // Interval untuk meningkatkan kesulitan
    if (isPlaying) {                                    // Cek jika game sedang berjalan
        difficulty += 0.1                               // Tingkatkan kesulitan
        const newDuration = Math.max(3 - (difficulty * 0.1), 1) // Hitung durasi animasi baru
        kaktus.style.animationDuration = `${newDuration}s`      // Update durasi animasi
    }
}, 5000)
