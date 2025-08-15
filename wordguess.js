windows.onload = start;

let currentWord, currentHint, revealedLetters, gameOver;

const words = [
    { word: "táo", hint: "Một loại trái cây màu đỏ hoặc xanh" },
    { word: "chuối", hint: "Một loại trái cây dài màu vàng" },
    { word: "chó", hint: "Một loại thú cưng phổ biến" },
    { word: "mèo", hint: "Con vật lông mềm, kêu meo meo" },
    { word: "bầu trời xanh", hint: "Thứ bạn thấy vào ngày nắng đẹp" },
    { word: "xúc xích", hint: "Món ăn phổ biến kẹp trong bánh mì" },
    { word: "pizza", hint: "Món Ý với phô mai và nhiều loại nhân" },
    { word: "xe hơi", hint: "Phương tiện bốn bánh" },
    { word: "kem", hint: "Món tráng miệng lạnh và ngọt" },
    { word: "mặt trời", hint: "Tỏa sáng vào ban ngày" },
    { word: "mưa", hint: "Rơi từ những đám mây" },
    { word: "sữa", hint: "Thức uống màu trắng từ bò" }
];

function updateWordDisplay() {
    document.getElementById("word").textContent = revealedLetters.join("");
}

function endGame(message) {
    document.getElementById("message").textContent = message;
    gameOver = true;
}

function start() {
    let choice = words[Math.floor(Math.random() * words.length)];
    currentWord = choice.word.toLowerCase();
    currentHint = choice.hint;
    gameOver = false;

    revealedLetters = [];
    for (let i = 0; i < currentWord.length; i++) {
        revealedLetters.push(currentWord[i] === " " ? " " : "_");
    }

    updateWordDisplay();
    document.getElementById("hint").textContent = "Gợi ý: " + currentHint;
    document.getElementById("error").textContent = "";
    document.getElementById("message").textContent = "";
}

function guessLetter() {
    if (gameOver) return;

    let guess = document.getElementById("letterGuess").value.toLowerCase();
    let error = document.getElementById("error");

    if (!/^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]$/i.test(guess)) {
        error.textContent = "Vui lòng nhập một ký tự hợp lệ.";
        return;
    }
    error.textContent = "";

    let found = false;
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === guess) {
            revealedLetters[i] = guess;
            found = true;
        }
    }

    updateWordDisplay();

    if (revealedLetters.join("") === currentWord) {
        endGame("Bạn đã đoán đúng!");
        gameData.currentScore += gameData.wheelValue;
        updateScore();
    } else if (!found) {
        error.textContent = `Không có ký tự "${guess}" trong từ.`;
    }

    document.getElementById("letterGuess").value = "";
}

// Hàm chơi lại
function newGame() {
    
    gameData.currentScore = 0;
    gameData.wheelValue = 0;
    gameData.hintsUsed = 0;
    gameData.wrongAttempts = 0;
    gameData.autoHintTimer = null;

    updateScore();
    document.getElementById('puzzleArea').classList.add('hidden');
    showStatus('Quay vòng để bắt đầu!', '');
}

// Hàm reset game
function resetGame() {

    // Lưu điểm vào bảng xếp hạng trước khi reset
    if (gameData.currentScore > 0 && gameData.playerName) {
        saveCurrentScore();
    }

    // Reset tất cả
    gameData = {
        playerName: '',
        currentScore: 0,
        wheelValue: 0,
        currentPuzzle: null,
        isSpinning: false,
        hintsUsed: 0,
        wrongAttempts: 0,
        autoHintTimer: null
    };

    document.getElementById('playerSetup').classList.remove('hidden');
    document.getElementById('gameArea').classList.add('hidden');
    document.getElementById('playerName').value = '';

    displayLeaderboard();
}
