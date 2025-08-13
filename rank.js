let leaderboardData = [];
function saveCurrentScore() {
    if (gameData.playerName && gameData.currentScore) {
       /* tìm người chơi trong bxh*/
        const existingPlayerIndex = leaderboardData.findIndex(entry => entry.name === gameData.playerName);

        if (existingPlayerIndex !== -1) {
            /*nếu tìm thấy tên người chơi trong bxh thì cập nhật điểm số*/
            leaderboardData[existingPlayerIndex].score += gameData.currentScore;}
        else {
            /*nếu duyệt không thấy thì tạo mục mới*/
            const scoreEntry = {
                name: gameData.playerName,
                score: gameData.currentScore};
            leaderboardData.push(scoreEntry);}
        
        /*Thông báo*/
        alert('Điểm của bạn đã được lưu vào bảng xếp hạng!');
    } else {
        alert('Không có điểm để lưu. Vui lòng chơi game trước.');
    }
}

function displayLeaderboard() {
    /* Lấy phần tử tbody của bảng xếp hạng*/
    const tableBody = document.querySelector('#leaderboardBody');

    /* Xóa các hàng cũ để cập nhật*/
    tableBody.innerHTML = '';

    /*Sắp xếp theo điểm số giảm dần*/
    leaderboardData.sort((a, b) => b.score - a.score);

    /* Duyệt mảng và tạo hàng */
   leaderboardData.forEach(function(entry, index) {
    const row = tableBody.insertRow();
        row.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td class="player-name">${entry.name}</td>
            <td class="player-score">${entry.score}</td>
        `;
    });

}
