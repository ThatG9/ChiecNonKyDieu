//Bat dau sau khi load xong tat ca
window.onload = start;

//tao bien
let currentWord, currentHint, revealedLetters, guessedLetters, gameOver;

//data
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

//Hien chu duoc chon
function updateWordDisplay() {
  let wordContainer = document.getElementById("word");
  wordContainer.textContent = revealedLetters.join("");
}

//Ket thuc
function endGame(message) {
    document.getElementById("message").textContent = message;
    gameOver = true;
}

//Bat dau
function start() {
    let choice = words[Math.floor(Math.random() * words.length)];
    currentWord = choice.word.toLowerCase();
    currentHint = choice.hint;
    
    //clearing previous data/flag
    guessedLetters = [];
    revealedLetters = [];
    gameOver = false;

    //display hidden word
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === " ") {
            revealedLetters.push(" ");
        } else {
            revealedLetters.push("_");
        }
    }

    updateWordDisplay();

    //write hint + clear previous msg
    document.getElementById("hint").textContent = "Gợi ý: " + currentHint;
    document.getElementById("error").textContent = "";
    document.getElementById("message").textContent = "";
}

// Doan chu
function guessLetter() {
    if (gameOver) return;

    const letterInput = document.getElementById("letterGuess");
    const guess = letterInput.value.toLowerCase();
    const error = document.getElementById("error");

    if (!guess.match(/^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]$/i)) {
        error.textContent = "Vui lòng nhập một ký tự (a-z hoặc tiếng Việt có dấu).";
        return;
    }

    if (guessedLetters.includes(guess)) {
        error.textContent = `Bạn đã đoán "${guess}" trước đó rồi.`;
        letterInput.value = "";
        return;
    }

    error.textContent = "";
    guessedLetters.push(guess);

    let found = false;
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === guess && revealedLetters[i] === "_") {
            revealedLetters[i] = guess;
            found = true;
        }
    }

    updateWordDisplay();

    if (revealedLetters.join("") === currentWord) {
        endGame("Bạn đã đoán đúng.");
    } else if (!found) {
        endGame(`Không có "${guess}" trong từ.`);
    }

    letterInput.value = "";
}

// Doan tu
function guessWord() {
    if (gameOver) return;

    let wordInput = document.getElementById("wordGuess");
    let guess = wordInput.value.trim().toLowerCase();
    let error = document.getElementById("error");

    if (guess === "") {
        error.textContent = "Vui lòng nhập một từ.";
        return;
    }
    error.textContent = "";

    if (guess === currentWord) {
        revealedLetters = currentWord.split("");
        updateWordDisplay();
        endGame("Bạn đã đoán đúng.");
    } else {
        endGame("Bạn đã đoán sai.");
    }

    wordInput.value = "";
}
