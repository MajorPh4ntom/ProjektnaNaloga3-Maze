let player = { x: 0, y: 0 }; // začetne koordinate v canvasu

// slike za igralca
const playerUpImg = new Image();
playerUpImg.src = "img/player_up.png";

const playerDownImg = new Image();
playerDownImg.src = "img/player_down.png";

const playerLeftImg = new Image();
playerLeftImg.src = "img/player_left.png";

const playerRightImg = new Image();
playerRightImg.src = "img/player_right.png";

let currentPlayerImg = playerDownImg;
let playerDirection = "down";

playerUpImg.onload = playerDownImg.onload = playerLeftImg.onload = playerRightImg.onload = () => {
    drawMaze();
};

let isMoving = false;
const moveSpeed = 2; // hitrost gibanja
const frameRate = 16; // fps

// seznam za shranjevanje sledi
let trail = [];
let playerTrailColor = "rgb(146, 211, 80)"; // barva sledi (poljubna barva z rahlim prosojnostjo)

document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        setup();
        resetPlayer(); // resetiraj igralca
    } else if (!isMoving && ["d", "a", "s", "w"].includes(e.key)) {
        movePlayer(e.key);
    }
});

// resetiranje igralca
function resetPlayer() {
    player.x = 0;
    player.y = 0;
    playerDirection = "down";
    currentPlayerImg = playerDownImg;
    trail = []; // ob ponovnem začetku igre očistimo sledi
    drawMaze(); // ponovno narišemo labirint brez sledi
}

// premikanje igralca (ob pritisku tipke)
function movePlayer(key) {
    if (isMoving) return;

    let dx = 0, dy = 0;

    if (key === "d") {
        dx = 1;
        playerDirection = "right";
        currentPlayerImg = playerRightImg;
    }
    if (key === "a") {
        dx = -1;
        playerDirection = "left";
        currentPlayerImg = playerLeftImg;
    }
    if (key === "s") {
        dy = 1;
        playerDirection = "down";
        currentPlayerImg = playerDownImg;
    }
    if (key === "w") {
        dy = -1;
        playerDirection = "up";
        currentPlayerImg = playerUpImg;
    }

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
                setTimeout(() => {
                    Swal.fire({
                        title: 'Bravo!',
                        text: 'Uspešno si pokosil in ustvaril pot!',
                        icon: 'success',
                        confirmButtonText: 'Igraj znova',
                        customClass: {
                            title: 'swal2-title',
                            popup: 'swal2-popup',
                            text: 'swal2-text',
                            confirmButton: 'swal2-confirm',
                            cancelButton: 'swal2-cancel'
                        }
                    }).then(() => {
                        setup(); // resetiraj maze
                        resetPlayer(); // resetiraj igralca na začetno pozicijo
                    });
                }, 100);
            }

            return;
        }

        // Očisti samo igralčevo prejšnjo pozicijo (brez zidov)
        ctx.clearRect(startX + (cellSize - 20) / 2, startY + (cellSize - 20) / 2, 20, 20);

        // Shrani točko sledi
        trail.push({ x: startX + (cellSize / 2), y: startY + (cellSize / 2) });

        // Nariši sledi kot povezane črte
        ctx.lineWidth = 13; // Nastavi debelino črte na 20
        ctx.lineJoin = "round"; // Zaokrožena povezava med črtami
        ctx.strokeStyle = playerTrailColor; // Nastavi barvo sledi
        ctx.beginPath();

        // Nariši povezane črte
        for (let i = 1; i < trail.length; i++) {
            let p1 = trail[i - 1];
            let p2 = trail[i];
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        }

        ctx.stroke(); // Nariši vse povezane črte

        // Izračunaj interpolirano pozicijo igralca za gladko gibanje
        let interpolatedX = startX + (endX - startX) * (step / cellSize);
        let interpolatedY = startY + (endY - startY) * (step / cellSize);

        // Nariši novo pozicijo igralca
        ctx.drawImage(currentPlayerImg, interpolatedX + (cellSize - 20) / 2, interpolatedY + (cellSize - 20) / 2, 20, 20);

        step += moveSpeed;
        requestAnimationFrame(animate); // requestAnimationFrame za gladko animacijo
    }

    animate();
}

// Funkcija za risanje igralca in sledi
function drawPlayer() {
    // Nariši vse sledi povezane v širšo črto
    if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y); // začni na prvi točki sledi

        trail.forEach(position => {
            ctx.lineTo(position.x, position.y); // risanje središčnih točk
        });

        ctx.lineWidth = 13; // Nastavi debelino črte na 20
        ctx.strokeStyle = playerTrailColor; // Nastavimo barvo sledi
        ctx.lineCap = "round"; // Za zaobljene robove črte
        ctx.stroke();
    }

    // Nariši trenutni položaj igralca
    ctx.drawImage(
        currentPlayerImg,
        player.x * cellSize + (cellSize - 20) / 2,
        player.y * cellSize + (cellSize - 20) / 2,
        20, 20
    );
}

// Overwrite original drawMaze function to include drawing of the player and trail
const originalDrawMaze = drawMaze;
drawMaze = function () {
    originalDrawMaze();
    drawPlayer();
};

// Resetiranje sledi ob ponovnem začetku igre
document.querySelector(".resetButton").addEventListener("click", () => {
    setup();
    resetPlayer();
});
