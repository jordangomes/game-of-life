// Initialise Canvas 
const canvas = document.getElementById('game-of-life')

// Initialise Context
const ctx = canvas.getContext('2d')

// Game variables
const gameWidth = 500
const gameHeight = 500
const gridCellSize = 20
let activeCells = []

// Viewport variables
const viewOffset = {
    x: 0,
    y: 0
}



document.addEventListener("DOMContentLoaded", function() { 
    drawGame(ctx, activeCells)

    registerClickListener(
        canvas, 
        (start, current) => {
            const newOffsetX = (current.x - start.x) * -1 + viewOffset.x
            const newOffsetY = (current.y - start.y) * -1 + viewOffset.y
            if(newOffsetX > 0) {
                viewOffset.x = newOffsetX
            } else {
                viewOffset.x = 0
            }
            if (newOffsetY > 0){
                viewOffset.y = newOffsetY
            } else {
                viewOffset.y = 0
            }
            console.log(viewOffset)
            drawGame(ctx)
        }, 
        () => {
            const cellX = Math.floor((event.pageX - canvas.clientLeft) / gridCellSize)
            const cellY = Math.floor((event.pageY - canvas.clientTop) / gridCellSize)
    
            let cellActive = activeCells.findIndex(cell => (cell.x == cellX && cell.y == cellY));
    
            if(cellActive != -1) {
                activeCells.splice(cellActive, 1);
            } else {
                activeCells.push({x: cellX, y: cellY})
            }
            drawGame(ctx)
        }
    )
});

function registerClickListener(element, drag, click) {
    const cursorStartPos = {}
    const cursorDragPos = {}
    let mousedown = false

    function withinDelta(event) {
        let deltaX = Math.abs(cursorStartPos.x - event.pageX)
        let deltaY = Math.abs(cursorStartPos.y - event.pageY)
        if (deltaX < gridCellSize && deltaY < gridCellSize) {
            return true
        } else {
            return false
        }
    }

    element.addEventListener('mousedown', function(event) {
        cursorStartPos.x = event.pageX
        cursorStartPos.y = event.pageY
        cursorDragPos.x = event.pageX
        cursorDragPos.y = event.pageY
        mousedown = true
    })

    element.addEventListener('mousemove', function(event) {
        if (mousedown && !withinDelta(event)) {
            drag(cursorDragPos, { x: event.pageX, y: event.pageY })
            cursorDragPos.x = event.pageX
            cursorDragPos.y = event.pageY
        }
    })

    element.addEventListener('mouseup', function(event) {
        if (withinDelta(event)) {
            click()
        }
        mousedown = false
    })
}

// render current frame
function drawGame(ctx) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, gameWidth, gameHeight, gridCellSize)
    drawActiveCells(ctx, activeCells)
}

//draw background grid
function drawGrid(ctx, width, height, cellSize){
    // draw columns
    for (let line = 1; line <= width; line++) {
        ctx.beginPath();
        ctx.moveTo((cellSize * line) - viewOffset.x, 0 - viewOffset.y);
        ctx.lineTo((cellSize * line) - viewOffset.x, (cellSize * height) - viewOffset.y);
        ctx.closePath();
        ctx.stroke();
    }
    // draw rows
    for (let line = 1; line <= height; line++) {
        ctx.beginPath();
        ctx.moveTo(0 - viewOffset.x, (cellSize * line) - viewOffset.y);
        ctx.lineTo((cellSize * width) - viewOffset.x, (cellSize * line) - viewOffset.y);
        ctx.closePath();
        ctx.stroke();
    }
}

// fill in active cells
function drawActiveCells(ctx, cells){
    for (const cellID in cells) {
        const cell = cells[cellID];
        ctx.fillRect((cell.x * gridCellSize) - viewOffset.x , (cell.y * gridCellSize) - viewOffset.y, gridCellSize, gridCellSize)
    }
}