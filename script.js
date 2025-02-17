const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// maze
const cols = 19; 
const rows = 19; 
const cellSize = 30;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let stack = [];

// smeri
const directions = [
    { x: 1, y: 0 },  // Right
    { x: -1, y: 0 }, // Left
    { x: 0, y: 1 },  // Down
    { x: 0, y: -1 }  // Up
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

        // rise
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

// generacija meza
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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let cell of grid) {
        cell.draw();
    }

    
    ctx.fillStyle = "rgba(0, 231, 12, 0.66)";
    ctx.fillRect(0, 0, cellSize, cellSize);

    
    ctx.fillStyle = "rgb(224, 0, 0)";
    ctx.fillRect((cols - 1) * cellSize, (rows - 1) * cellSize, cellSize, cellSize);
}


setup();


document.querySelector(".resetButton").addEventListener("click", () => {
    setup();
});
