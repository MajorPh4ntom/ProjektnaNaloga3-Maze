const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// labirint
const cols = 19; 
const rows = 19; 
const cellSize = 30;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let stack = [];

// smeri
const directions = [
    { x: 1, y: 0 },  // desno
    { x: -1, y: 0 }, // levo
    { x: 0, y: 1 },  // dol
    { x: 0, y: -1 }  // gor
];

// celice
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
    }

    draw() {
        let x = this.x * cellSize;
        let y = this.y * cellSize;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        // risanje
        if (this.walls.top) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y), ctx.stroke();
        if (this.walls.right) ctx.beginPath(), ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if (this.walls.bottom) ctx.beginPath(), ctx.moveTo(x, y + cellSize), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if (this.walls.left) ctx.beginPath(), ctx.moveTo(x, y), ctx.lineTo(x, y + cellSize), ctx.stroke();
    }

    checkNeighbors() {
        let neighbors = [];

        for (let dir of directions) {
            let nx = this.x + dir.x;
            let ny = this.y + dir.y;
            let index = getIndex(nx, ny);
            if (index !== -1 && !grid[index].visited) {
                neighbors.push(grid[index]);
            }
        }

        return neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
    }
}

// inicijalizacija
function setup() {
    grid = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push(new Cell(x, y));
        }
    }
    generateMaze();
    drawMaze();
}

// generacija labirint
function generateMaze() {
    let current = grid[0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
        let next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(next);
            removeWalls(current, next);
            current = next;
        } else {
            current = stack.pop();
        }
    }
}


function removeWalls(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;

    if (dx === 1) {
        a.walls.left = false;
        b.walls.right = false;
    } else if (dx === -1) {
        a.walls.right = false;
        b.walls.left = false;
    }

    if (dy === 1) {
        a.walls.top = false;
        b.walls.bottom = false;
    } else if (dy === -1) {
        a.walls.bottom = false;
        b.walls.top = false;
    }
}


function getIndex(x, y) {
    return (x >= 0 && x < cols && y >= 0 && y < rows) ? y * cols + x : -1;
}


function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let cell of grid) {
        cell.draw();
    }

    // velikost
    const smallerCellSize = cellSize * 0.6;

    // zeleni kvadratek
    ctx.fillStyle = "rgba(0, 102, 255)";
    ctx.fillRect((cellSize - smallerCellSize) / 2, 
                 (cellSize - smallerCellSize) / 2, 
                 smallerCellSize, smallerCellSize);

    // rdeci kvadratek
    ctx.fillStyle = "rgb(224, 0, 0)";
    ctx.fillRect((cols - 1) * cellSize + (cellSize - smallerCellSize) / 2, 
                 (rows - 1) * cellSize + (cellSize - smallerCellSize) / 2, 
                 smallerCellSize, smallerCellSize);
}


const musicPlayer = document.getElementById("musicPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const volumeSlider = document.getElementById("volumeSlider");
const songNameDisplay = document.getElementById("songName"); // shranjujes ime pesmi

// datoteke
const audioFiles = [
    { file: "audio/lofi_1_Kainbeats - mindscapes.mp3", name: "Kainbeats - Mindscapes" },
    { file: "audio/lofi_2_kudasai - love lasts.mp3", name: "Kudasai - Love lasts" },
    { file: "audio/lofi_3_WYS - lone (ft. ease.).mp3", name: "WYS - Lone (ft. ease.)" },
    { file: "audio/lofi_4_idealism - seeing you.mp3", name: "Idealism - Seeing you" },
    { file: "audio/lofi_5_austin chen - faces.mp3", name: "Austin Chen - Faces" }
];

let currentTrack = 0;
let isPlaying = false; // se predvaja? (belezi ce se ali ne)

function updateTrack() {
    musicPlayer.src = audioFiles[currentTrack].file;
    musicPlayer.play(); 
    songNameDisplay.textContent = audioFiles[currentTrack].name; // ime glasbe
    isPlaying = true; 
    playPauseButton.textContent = "▶️"; 
}

// pause/play
playPauseButton.addEventListener("click", () => {
    if (musicPlayer.paused) {
        musicPlayer.play();
        isPlaying = true;
        playPauseButton.textContent = "⏸️"; 
    } else {
        musicPlayer.pause();
        isPlaying = false;
        playPauseButton.textContent = "▶️"; 
    }
});

// play naslednjo
nextButton.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % audioFiles.length; 
    updateTrack(); 
    playPauseButton.textContent = "⏸️";
});

// play prejsnjo
prevButton.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length; 
    updateTrack(); 
    playPauseButton.textContent = "⏸️";
});

// zvok
volumeSlider.addEventListener("input", () => {
    musicPlayer.volume = volumeSlider.value;
});

// auto player
musicPlayer.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % audioFiles.length;
    updateTrack(); 
    playPauseButton.textContent = "⏸️";
});

// zacni glasbo
updateTrack();
setup();

//credits
document.querySelector('.creditsButton').addEventListener('click', () => {
  Swal.fire({
    title: 'Vizitka',
    text: 'Maj Klinc, 4. Rb',
    icon: 'info',
    confirmButtonText: 'V redu',
    color: 'black',
    confirmButtonColor: '#4CAF50',
    padding: '20px',
    showCloseButton: true,
    showCancelButton: false
  });
});

//navodila
document.querySelector('.navodilaButton').addEventListener('click', () => {
  Swal.fire({
    title: 'Navodila za igro',
    html: `
    <p>1. Cilj igre je priti od začetka (moder kvadratek) do konca (rdeči kvadratek) in izrisati pot s robotsko kosilnico.</p>
    <p>2. Premikaj kosilnico z uporabo tipk: w, a, s, d.</p>
    <p>3. Labirint lahko resetiraš s klikom na gumb "Resetiraj Labirint" ali s pritiskom na tipko "r".</p>
    `,
    icon: 'info',
    confirmButtonText: 'V redu',
    color: 'black',
    confirmButtonColor: '#4CAF50',
    padding: '20px',
    showCloseButton: true,
    showCancelButton: false
  });
});

