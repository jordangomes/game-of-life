// Initialise Canvas 
const canvas = document.getElementById('game-of-life')

// Initialise Context
const ctx = canvas.getContext('2d')

// Game variables
const gameWidth = 500
const gameHeight = 500
const gridCellSize = 20
let gameTimer
//setup board
let board = new Array(gameHeight)

for (let i = 0; i < board.length; i++) {
    board[i] = new Array(gameWidth)
}

// Viewport variables
const viewOffset = {
    x: 0,
    y: 0
}

function start() {
    gameTimer = setInterval(() => step(), 500)
}

function stop() {
    clearInterval(gameTimer)
}

// step forward in game
function step() {
    const nextBoard = board.map(inner => inner.slice())
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const neighbours = neighbourCount(x,y)
            const tileAlive = getTile(x, y)
            if(tileAlive && neighbours < 4 && neighbours > 1) {
                nextBoard[y][x] = true
            } else if(neighbours == 3) {
                nextBoard[y][x] = true
            } else if(tileAlive) {
                nextBoard[y][x] = false
            }
        }
    }
    board = nextBoard.map(inner => inner.slice())
    drawGame(ctx)
}

function neighbourCount(x, y) {
    let count = 0
    const neighbours = [
        [-1, -1], [-1, 0], [-1, +1],
        [ 0, -1], /* us */ [ 0, +1],
        [+1, -1], [+1, 0], [+1, +1]
    ]
    
    neighbours.forEach(offset => {
        if(getTile(x + offset[1], y + offset[0])) {
            count++
        }
    })
    return count
}

function getTile(x, y) {
    const result = x >= 0 && y >= 0 && x < gameWidth && y < gameHeight && board[y][x];
    if(typeof result == 'undefined') {
        return false
    } else {
        return result
    }
}


// on load
document.addEventListener("DOMContentLoaded", function() { 
    drawGame(ctx)

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
            
            drawGame(ctx)
        }, 
        (event) => {
            const cellX = Math.floor((event.pageX - canvas.clientLeft + viewOffset.x) / gridCellSize)
            const cellY = Math.floor((event.pageY - canvas.clientTop + viewOffset.y) / gridCellSize)
            
            if(board[cellY][cellX] == true) {
                board[cellY][cellX] = false
            } else {
                board[cellY][cellX] = true
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
        if (deltaX < 5 && deltaY < 5) {
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
        canvas.style.cursor = "pointer"
    })

    element.addEventListener('mousemove', function(event) {
        if (mousedown && !withinDelta(event)) {
            drag(cursorDragPos, { x: event.pageX, y: event.pageY })
            cursorDragPos.x = event.pageX
            cursorDragPos.y = event.pageY
            canvas.style.cursor = "grabbing"
        }
    })

    element.addEventListener('mouseup', function(event) {
        if (withinDelta(event)) {
            click(event)
        }
        canvas.style.cursor = "auto"
        mousedown = false
    })
}

// render current frame
function drawGame(ctx) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, gameWidth, gameHeight, gridCellSize)
    drawActiveCells(ctx)
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
function drawActiveCells(ctx){
    for (const rowIndex in board) {
        for (const cellIndex in board[rowIndex]) {
            if(board[rowIndex][cellIndex]) {
                ctx.fillRect((cellIndex * gridCellSize) - viewOffset.x , (rowIndex * gridCellSize) - viewOffset.y, gridCellSize, gridCellSize)
            }
        }
        
    }
}