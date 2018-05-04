const WIDTH = 12;
const HEIGHT = 20;
const BLOCK_PIXELS = 30;

let gameState = {
  state: 'WAITING',
  score: 0,
  board: generateBoard(WIDTH, HEIGHT),
  currentPiece: null,
  nextPiece: null,
  delta: 0,
  linesCleared: 0
};

function level(linesCleared) {
  return Math.ceil(linesCleared / 15) || 1;
}

function generateBoard(width, height) {
  const board = [];
  for (let lineIndex = 0; lineIndex < height; lineIndex++) {
    const line = [];
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      line.push(null);
    }
    board.push(line);
  }
  return board;
}



function clearLines(board) {
  let numberOfFullLines = 0;
  let lineIndex = board.length - 1;
  while (lineIndex >= 0) {
    const line = board[lineIndex];

    let columnIndex = 0;
    let isFullLine = true;

    while (columnIndex < line.length) {
      if (!board[lineIndex][columnIndex]) {
        isFullLine = false;
        break;
      }
      columnIndex++;
    }
    if (isFullLine) {
      numberOfFullLines++;
      let replaceLineIndex = lineIndex;
      while (replaceLineIndex > 0) {
        board[replaceLineIndex] = board[replaceLineIndex - 1];
        replaceLineIndex--;
      }
      columnIndex = 0;
      board[0] = [];
      while (columnIndex < board[replaceLineIndex + 1].length) {
        board[0].push(null);
        columnIndex++;
      }
      lineIndex++;
    }
    lineIndex--;
  }
  switch (numberOfFullLines) {
    case 1:
      gameState.score += 40;
      break;
    case 2:
      gameState.score += 100;
      break;
    case 3:
      gameState.score += 300;
      break;
    case 4:
      gameState.score += 1200;
      break;
  }
  gameState.linesCleared += numberOfFullLines;
}

function update(newDelta, board) {
  if (gameState.state === 'STARTED') {
    gameState.delta += newDelta;

    if (gameState.delta > (500 - level() * 25)) {
      gameState.delta = 0;
      if (pieceHandling.canGo(gameState.board, gameState.currentPiece, 1, 0)) {
        pieceHandling.goesDown(gameState.currentPiece);
      } else {
        pieceHandling.transferPieceToBoard(gameState.currentPiece, gameState.board);
        clearLines(gameState.board);
        gameState.currentPiece = gameState.nextPiece;
        gameState.nextPiece = piece.generateNewPiece();
        if (pieceHandling.hasCollision(gameState.board, gameState.currentPiece)) {
          gameState.state = 'OVER';
          start.style.display = 'block';
        }
      }
    }
  }
}

function draw(board, piece) {
  const boardAndPiece = [];
  for (let lineIndex in board) {
    boardAndPiece[lineIndex] = board[lineIndex].slice(0);
  }
  if (piece) {
    for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
      const line = piece.content[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length ; columnIndex++) {
        const pieceSquare = line[columnIndex];
        if (pieceSquare) {
          boardAndPiece[piece.y + lineIndex][piece.x + columnIndex] = pieceSquare;
        }
      }
    }
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, WIDTH * BLOCK_PIXELS, HEIGHT * BLOCK_PIXELS);

  for (let lineIndex in boardAndPiece) {
    const line = boardAndPiece[lineIndex];
    for (let columnIndex in line) {
      const square = line[columnIndex];
      ctx.fillStyle = square || 'black';
      ctx.fillRect(columnIndex * BLOCK_PIXELS, lineIndex * BLOCK_PIXELS, (columnIndex + 1) * BLOCK_PIXELS, (lineIndex + 1) * BLOCK_PIXELS);
    }
  }

  if (gameState.nextPiece) {
    const nextPieceCanvas = document.getElementById('next-piece');
    nextPieceCanvas.setAttribute('width', gameState.nextPiece.content[0].length * BLOCK_PIXELS);
    nextPieceCanvas.setAttribute('height', gameState.nextPiece.content.length * BLOCK_PIXELS);

    const nextPieceCtx = nextPieceCanvas.getContext('2d');

    for (let lineIndex = 0; lineIndex < gameState.nextPiece.content.length; lineIndex++) {
      const line = gameState.nextPiece.content[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length ; columnIndex++) {
        const pieceSquare = line[columnIndex];
        nextPieceCtx.fillStyle = pieceSquare || 'white';
        nextPieceCtx.fillRect(columnIndex * BLOCK_PIXELS, lineIndex * BLOCK_PIXELS, (columnIndex + 1) * BLOCK_PIXELS, (lineIndex + 1) * BLOCK_PIXELS);
      }
    }
  }

  const scoreSpan = document.getElementById('score');
  scoreSpan.innerHTML = `Score: ${gameState.score}`;

  const currentLevel = level(gameState.linesCleared);
  const levelSpan = document.getElementById('level');
  levelSpan.innerHTML = `Level: ${currentLevel}`;
}

MainLoop.setUpdate((delta) => update(delta, gameState.board));
MainLoop.setDraw(() => draw(gameState.board, gameState.currentPiece));
MainLoop.start();

const start = document.getElementById('start');
const html = document.getElementById('html');

const keyBoardEvents = (event) => {
  if (event.keyCode === 37 && pieceHandling.canGo(gameState.board, gameState.currentPiece, 0, -1)) {
    gameState.currentPiece.x -= 1;
  } else if (event.keyCode === 39 && pieceHandling.canGo(gameState.board, gameState.currentPiece, 0, 1)) {
    gameState.currentPiece.x += 1;
  } else if (event.keyCode === 38 && pieceHandling.canRotate(gameState.board, gameState.currentPiece, true)) {
    pieceHandling.rotate(false, gameState.currentPiece);
  } else if (event.keyCode === 40 && pieceHandling.canRotate(gameState.board, gameState.currentPiece, false)) {
    pieceHandling.rotate(true, gameState.currentPiece);
  } else if (event.keyCode === 32 && pieceHandling.canGo(gameState.board, gameState.currentPiece, 1, 0)) {
    gameState.currentPiece.y = gameState.currentPiece.y + 1;
  }
};

start.addEventListener('click', () => {
  gameState.state = 'STARTED';
  gameState.board = generateBoard(WIDTH, HEIGHT);
  gameState.delta = 0;
  gameState.currentPiece = piece.generateNewPiece();
  gameState.nextPiece = piece.generateNewPiece();
  gameState.score = 0;
  html.removeEventListener('keydown', keyBoardEvents, false);
  html.addEventListener('keydown', keyBoardEvents, false);

  start.style.display = 'none';
});
