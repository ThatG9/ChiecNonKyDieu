// Biến lưu trữ trạng thái game
let gameData = {
    playerName: '',
    currentScore: 0,
    wheelValue: 0,
    isSpinning: false,
    currentRotation: 0,
    currentWord: '',
    currentHint: '',
    revealedLetters: [],
};
// Mảng chứa các từ và gợi ý
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
// Giá trị vòng quay (6 ô)
const wheelValues = [100, 200, 300, 500, 'MẤT LƯỢT', 400];

// Hàm bắt đầu game
function startGame() {
    // Kiểm tra tên người chơi
    const name = document.getElementById('playerName').value.trim();
    // Nếu tên rỗng, hiển thị cảnh báo
    if (name === '') {
        alert('Vui lòng nhập tên!');
        return;
    }
    // Lưu tên người chơi và khởi tạo điểm số
    gameData.playerName = name;
    gameData.currentScore = 0;

    document.getElementById('currentPlayer').textContent = name;
    document.getElementById('playerSetup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');

    updateScore();
}
//ham quay vòng
function spinWheel() {
    if (gameData.isSpinning)
        return;

    gameData.isSpinning = true;
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');

    spinBtn.disabled = true;
    spinBtn.textContent = 'Đang quay...';

    // Lấy vị trí ô ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * wheelValues.length);
    const result = wheelValues[randomIndex];

    const segments = wheelValues.length; // Số ô trên vòng quay (6)
    const segmentAngle = 360 / segments; // Góc mỗi ô (60 độ)

    // Tính góc giữa ô cần dừng (giữa ô)
    const sectorCenter = randomIndex * segmentAngle + (segmentAngle / 2);

    // Tính góc cần quay để mũi tên cố định chỉ đúng ô (xoay ngược) tu 0 độ
    const alignAngle = (360 - sectorCenter) % 360;

    // Lấy góc hiện tại 
    const current = gameData.currentRotation % 360;

    // Tính góc cần quay thêm 
    const delta = (alignAngle - current + 360) % 360;

    // Cố định số vòng quay thêm (4 vòng = 1440 độ)
    const extraSpins = 4;

    // Cộng dồn góc quay tổng
    gameData.currentRotation += extraSpins * 360 + delta;

    // Thiết lập hiệu ứng quay 3 giây, easing ease-out
    wheel.style.transition = 'transform 3s ease-out';

    // Thực hiện quay vòng
    wheel.style.transform = `rotate(${gameData.currentRotation}deg)`;

    //  dùng setTimeout để xử lý sau 3 giây (khoảng thời gian quay)
    setTimeout(function () {
        gameData.isSpinning = false;
        gameData.wheelValue = result;

        spinBtn.disabled = false;
        spinBtn.textContent = 'Quay vòng';

        if (result === 'MẤT LƯỢT') {
            showStatus('Rất tiếc! Bạn bị mất lượt. Hãy quay lại!', 'lose');
            document.getElementById('puzzleArea').classList.add('hidden');
        } else {
            showStatus(`Tuyệt vời! Bạn quay được ${result} điểm. Hãy giải câu đố!`, 'win');
            showPuzzle();
        }
    }, 3000);
}
// Hàm hiển thị trạng thái
function showStatus(message, type) {
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = message;

    // Xóa class cũ
    statusElement.classList.remove('status-win', 'status-lose', 'blink');

    // Thêm class mới
    if (type === 'win') {
        statusElement.classList.add('status-win', 'blink');
    } else if (type === 'lose') {
        statusElement.classList.add('status-lose');
    }
}

// Hàm cập nhật điểm
function updateScore() {
    document.getElementById('currentScore').textContent = gameData.currentScore;
}


function updateWordDisplay() {
    document.getElementById("word").textContent = gameData.revealedLetters.join("");
}

function showPuzzle() {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    gameData.currentWord = randomWord.word.toLowerCase();
    gameData.currentHint = randomWord.hint;
    
    gameData.revealedLetters = [];
    // tạo gạch dưới cho mỗi chữ cái
    for (let i = 0; i < gameData.currentWord.length; i++) {
        gameData.revealedLetters.push(gameData.currentWord[i] === " " ? " " : "_");
    }

    updateWordDisplay();

    document.getElementById("hint").textContent = "Gợi ý: " + gameData.currentHint;
    document.getElementById('puzzleArea').classList.remove('hidden');
    document.getElementById('letterGuess').value = '';
}

function guessLetter() {
    let guess = document.getElementById("letterGuess").value.toLowerCase();

    if (!/^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]$/i.test(guess)) {
        showStatus("Vui lòng nhập một chữ cái hợp lệ!", "lose");
        document.getElementById("letterGuess").value = "";
        return;
    }

    let found = false;
    for (let i = 0; i < gameData.currentWord.length; i++) {
        if (gameData.currentWord[i] === guess) {
            gameData.revealedLetters[i] = guess;
            found = true;
        }
    }
    updateWordDisplay();
    if (gameData.revealedLetters.join("") === gameData.currentWord) {
        let points = gameData.wheelValue;
        gameData.currentScore += points;
        updateScore();
        showStatus(`Chúc mừng! Bạn đã đoán đúng từ "${gameData.currentWord}.Bạn được ${points} điểm!`, "win");
    // Ẩn câu đố sau 2 giây
    setTimeout(function () {
        document.getElementById('puzzleArea').classList.add('hidden');
        showStatus('Quay vòng để tiếp tục!', '');
    }, 2000);
    } else if (!found) {
        showStatus(`Rất tiếc! Chữ "${guess}" không có trong từ. Hãy thử lại!`, "lose");
    }
    document.getElementById("letterGuess").value = "";
}

// Khởi tạo game khi trang web load
window.onload = function () {
    loadLeaderboard();

    // Thêm sự kiện Enter cho input
    document.getElementById('playerName').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });

    document.getElementById('letterGuess').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            guessLetter();
        }
    });
}
