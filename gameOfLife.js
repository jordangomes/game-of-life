// Initialise Canvas 
const canvas = document.getElementById('game-of-life')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Initialise Context
const ctx = canvas.getContext('2d')

// Game variables
const gameWidth = 20
const gameHeight = 20
const gridCellSize = 20
const activeCells = []

function drawGrid(ctx, width, height, cellSize){
    // draw columns
    for (let line = 1; line <= width; line++) {
        ctx.beginPath();
        ctx.moveTo(cellSize * line, 0);
        ctx.lineTo(cellSize * line, cellSize * height);
        ctx.closePath();
        ctx.stroke();
    }
    // draw rows
    for (let line = 1; line <= height; line++) {
        ctx.beginPath();
        ctx.moveTo(0, cellSize * line);
        ctx.lineTo(cellSize * width, cellSize * line);
        ctx.closePath();
        ctx.stroke();
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    drawGrid(ctx, gameWidth, gameHeight, gridCellSize)

    // Add event listener for `click` events.
    canvas.addEventListener('click', function(event) {
        const clickX = event.pageX - canvas.clientLeft
        const clickY = event.pageY - canvas.clientTop
        const cellX = Math.floor(clickX/gridCellSize)
        const cellY = Math.floor(clickY/gridCellSize)
        console.log(`x: ${cellX}, y: ${cellY}`)
    }, false);
});
