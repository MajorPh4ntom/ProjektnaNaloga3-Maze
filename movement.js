
let player = { x: 0, y: 0 };


const playerImg = new Image();
playerImg.src = "assets/player.png";
playerImg.onload = () => {
    drawMaze(); 
};


let isMoving = false;
const moveSpeed = 1; // hitrost movement
const frameRate = 10;


document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        setup(); 
        resetPlayer(); // reset igralca
    } else if (!isMoving && ["d", "a", "s", "w"].includes(e.key)) { // ArrowRight, ArrowLeft, ArrowDown, ArrowUp
        movePlayer(e.key);
    }
});


function resetPlayer() {
    player.x = 1;
    player.y = 1;
    drawMaze();
}


function movePlayer(key) {
    if (isMoving) return;

    let dx = 0, dy = 0;

    if (key === "d") dx = 1;
    if (key === "a") dx = -1;
    if (key === "s") dy = 1;
    if (key === "w") dy = -1;

    let newX = player.x + dx;
    let newY = player.y + dy;
    let currentIndex = getIndex(player.x, player.y);
    let newIndex = getIndex(newX, newY);

    if (newIndex === -1) return;

    let currentCell = grid[currentIndex];
    let newCell = grid[newIndex];

    
    if (dx === 1 && currentCell.walls.right) return; 
    if (dx === -1 && currentCell.walls.left) return; 
    if (dy === 1 && currentCell.walls.bottom) return; 
    if (dy === -1 && currentCell.walls.top) return; 

    smoothMove(newX, newY);
}


function smoothMove(targetX, targetY) {
    let startX = player.x * cellSize;
    let startY = player.y * cellSize;
    let endX = targetX * cellSize;
    let endY = targetY * cellSize;
    let step = 0;
    
    isMoving = true;

    function animate() {
        if (step >= cellSize) {
            player.x = targetX;
            player.y = targetY;
            drawMaze();
            isMoving = false;

            
            if (player.x === cols - 1 && player.y === rows - 1) {
                setTimeout(() => alert("Bravo!"), 100);
            }
            return;
        }

        drawMaze();
        let interpolatedX = startX + (endX - startX) * (step / cellSize);
        let interpolatedY = startY + (endY - startY) * (step / cellSize);

        ctx.drawImage(playerImg, interpolatedX + (cellSize - 20) / 2, interpolatedY + (cellSize - 20) / 2, 20, 20);

        step += moveSpeed;
        setTimeout(animate, frameRate);
    }

    animate();
}

function drawPlayer() {
    ctx.drawImage(
        playerImg,
        player.x * cellSize + (cellSize - 20) / 2,
        player.y * cellSize + (cellSize - 20) / 2,
        20, 20 
    );
}


const originalDrawMaze = drawMaze;
drawMaze = function () {
    originalDrawMaze(); 
    drawPlayer(); 
};


document.querySelector(".resetButton").addEventListener("click", () => {
    setup();
    resetPlayer();
});
