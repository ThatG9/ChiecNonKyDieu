let leaderboardData = [];

function saveLeaderboard() {
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

function loadLeaderboard() {
    const savedData = localStorage.getItem('leaderboardData');
    if (savedData) {
        leaderboardData = JSON.parse(savedData);
    }
}


function displayLeaderboard() {
    const tableBody = document.getElementById("leaderboardBody");
    tableBody.innerHTML = "";
    leaderboardData.sort((a, b) => b.score - a.score);
    const top10Players = leaderboardData.slice(0, 10);
    top10Players.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td class="player-name">${entry.name}</td>
            <td class="player-score">${entry.score}</td>
        `;
    });
}

function saveCurrentScore() {
    if (gameData.playerName && gameData.currentScore) {
        /* tìm người chơi trong bxh*/
        const existingPlayerIndex = leaderboardData.findIndex(entry => entry.name === gameData.playerName);

        if (existingPlayerIndex !== -1) {
            /*nếu tìm thấy tên người chơi trong bxh thì cập nhật điểm số*/
            leaderboardData[existingPlayerIndex].score += gameData.currentScore;
        }
        else {
            /*nếu duyệt không thấy thì tạo mục mới*/
            const scoreEntry = {
                name: gameData.playerName,
                score: gameData.currentScore
            };
            leaderboardData.push(scoreEntry);
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

window.addEventListener('load', () => {
    loadLeaderboard();
    displayLeaderboard();
});

