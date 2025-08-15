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
    leaderboardData: [],
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
    // Lấy tên người chơi từ input
    const name = document.getElementById('playerName').value.trim();
    // Nếu tên rỗng, hiển thị cảnh báo
    if (name === '') {
        alert('Vui lòng nhập tên!');
        return;
    }
    // Lưu tên người chơi và khởi tạo điểm số
    gameData.playerName = name;
    gameData.currentScore = 0;
    // Hiển thị tên người chơi trên giao diện
    document.getElementById('currentPlayer').textContent = name;
    // Ẩn phần nhập tên và hiển thị khu vực chơi game
    document.getElementById('playerSetup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');

    // Hiển thị điểm số ban đầu
    displayLeaderboard();
    updateScore();
}
//ham quay vòng
function spinWheel() {
    // Kiểm tra nếu đang quay thì không cho quay nữa
    if (gameData.isSpinning)
        return;
    // Thiết lập trạng thái quay
    gameData.isSpinning = true;
    // Lấy phần tử vòng quay và nút quay
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    //vô hiệu hóa nút quay  
    spinBtn.disabled = true;
    //đặt lại thông báo
    spinBtn.textContent = 'Đang quay...';

    // Lấy vị trí ô ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * wheelValues.length);
    // Lấy giá trị của ô ngẫu nhiên
    const result = wheelValues[randomIndex];

    const segments = wheelValues.length; // Số ô trên vòng quay (6)
    const segmentAngle = 360 / segments; // Góc mỗi ô (60 độ)

    // Tính góc giữa ô cần dừng (giữa ô)
    const sectorCenter = randomIndex * segmentAngle + (segmentAngle / 2);

    // Tính góc cần quay để mũi tên cố định chỉ đúng ô (xoay ngược) từ 0 độ
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
        // cập nhật nếu đã quay xong
        gameData.isSpinning = false;
        // Cập nhật góc hiện tại
        gameData.wheelValue = result;
        //bỏ vô hiệu hóa nút quay
        spinBtn.disabled = false;
        //cho quay lại
        spinBtn.textContent = 'Quay vòng';
        //Thông báo sau khi quay xong
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

// Hàm cập nhật hiển thị từ
function updateWordDisplay() {
    document.getElementById("word").textContent = gameData.revealedLetters.join("");
}
// Hàm hiển thị câu đố
function showPuzzle() {
    // Lấy một từ ngẫu nhiên từ mảng words
    let randomWord = words[Math.floor(Math.random() * words.length)];
    gameData.currentWord = randomWord.word.toLowerCase();
    // Lưu gợi ý
    gameData.currentHint = randomWord.hint;
    // Reset các biến liên quan đến câu đố
    gameData.revealedLetters = [];
    // tạo gạch dưới cho mỗi chữ cái
    for (let i = 0; i < gameData.currentWord.length; i++) {
        gameData.revealedLetters.push(gameData.currentWord[i] === " " ? " " : "_");
    }
    // Cập nhật hiển thị từ
    updateWordDisplay();
    // Hiển thị gợi ý
    document.getElementById("hint").textContent = "Gợi ý: " + gameData.currentHint;
    document.getElementById('puzzleArea').classList.remove('hidden');
    document.getElementById('letterGuess').value = '';
}
//hàm đoán chữ cái
function guessLetter() {
    let guess = document.getElementById("letterGuess").value.toLowerCase();
    //kiểm tra tính hợp lệ của chữ cái
    if (guess.length !== 1 || !/^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]$/i.test(guess)) {
        showStatus("Vui lòng nhập một chữ cái hợp lệ!", "lose");
        document.getElementById("letterGuess").value = "";
        return;
    }
    // Kiểm tra nếu đã đoán chữ cái này
    let found = false;
    for (let i = 0; i < gameData.currentWord.length; i++) {
        if (gameData.currentWord[i] === guess) {
            gameData.revealedLetters[i] = guess;
            found = true;
        }
    }
    //cập nhật từ
    updateWordDisplay();
    //nếu đoán đúng thì cộng điểm
    if (gameData.revealedLetters.join("") === gameData.currentWord) {
        let points = gameData.wheelValue;
        gameData.currentScore += points;
        updateScore();
        showStatus(`Chúc mừng! Bạn đã đoán đúng từ "${gameData.currentWord}".Bạn được ${points} điểm!`, "win");
        // Ẩn câu đố sau 2 giây
        setTimeout(function () {
            document.getElementById('puzzleArea').classList.add('hidden');
            showStatus('Quay vòng để tiếp tục!', '');
        }, 4000);
    } else if (!found) {
        showStatus(`Rất tiếc! Chữ "${guess}" không có trong từ. Hãy thử lại!`, "lose");
    }
    document.getElementById("letterGuess").value = "";
}
// Hàm chơi lại
function newGame() {
    // Reset gameData

    gameData.currentScore = 0;
    gameData.wheelValue = 0;
    gameData.revealedLetters = [];
    gameData.currentWord = '';
    gameData.currentHint = '';
    updateScore();

    //reset giao diện
    document.getElementById('puzzleArea').classList.add('hidden');
    document.getElementById('letterGuess').value = '';
    document.getElementById('wheelResult').textContent = '';
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
        isSpinning: false,
        currentRotation: 0,
        currentWord: '',
        currentHint: '',
        revealedLetters: [],
    };
    loadLeaderboard(); // Tải lại bảng xếp hạng

    document.getElementById('playerSetup').classList.remove('hidden');
    document.getElementById('gameArea').classList.add('hidden');
    document.getElementById('playerName').value = '';

    displayLeaderboard();
}



function saveLeaderboard() {
    localStorage.setItem('leaderboardData', JSON.stringify(gameData.leaderboardData));
}

function loadLeaderboard() {
    const savedData = localStorage.getItem('leaderboardData');
    if (savedData) {
        gameData.leaderboardData = JSON.parse(savedData);
    }
}

// Hàm hiển thị bảng xếp hạng
function displayLeaderboard() {
    const tableBody = document.getElementById("leaderboardBody");
    tableBody.innerHTML = "";
    gameData.leaderboardData.sort((a, b) => b.score - a.score);
    const top10Players = gameData.leaderboardData.slice(0, 10);
    top10Players.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td class="rank">#${index + 1}</td>
            <td class="player-name">${entry.name}</td>
            <td class="player-score">${entry.score}</td>
        `;
    });
}
// Hàm lưu điểm hiện tại vào bảng xếp hạng
function saveCurrentScore() {
    if (gameData.playerName && gameData.currentScore) {
        /* tìm người chơi trong bxh*/
        const existingPlayerIndex = gameData.leaderboardData.findIndex(entry => entry.name === gameData.playerName);

        if (existingPlayerIndex !== -1) {
            /*nếu tìm thấy tên người chơi trong bxh thì cập nhật điểm số*/
            gameData.leaderboardData[existingPlayerIndex].score += gameData.currentScore;
        }
        else {
            /*nếu duyệt không thấy thì tạo mục mới*/
            const scoreEntry = {
                name: gameData.playerName,
                score: gameData.currentScore
            };
            gameData.leaderboardData.push(scoreEntry);
        }
        gameData.currentScore = 0;
        updateScore();

        saveLeaderboard();
        displayLeaderboard();

        /*Thông báo*/
        alert('Điểm của bạn đã được lưu vào bảng xếp hạng!');
    } else {
        alert('Không có điểm để lưu. Vui lòng chơi game trước.');
    }
}

// Khởi tạo game khi trang web load
window.onload = function () {
    loadLeaderboard();
    displayLeaderboard();

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

