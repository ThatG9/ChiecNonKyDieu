// Biến lưu trữ trạng thái game
let gameData = {
    playerName: '',
    currentScore: 0,
    wheelValue: 0,
    currentPuzzle: null,
    isSpinning: false,
    hintsUsed: 0,
    wrongAttempts: 0,
    autoHintTimer: null,
    currentRotation: 0
};
// Giá trị vòng quay (6 ô)
const wheelValues = [100, 200, 300, 500, 'MẤT LƯỢT', 400];

// Hàm bắt đầu game
function startGame() {
    const name = document.getElementById('playerName').value.trim();

    if (name === '') {
        alert('Vui lòng nhập tên!');
        return;
    }

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