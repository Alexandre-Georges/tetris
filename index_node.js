const MainLoop = require('mainloop.js');
const ioHook = require('iohook');

const WIDTH = 12;
const HEIGHT = 20;

ioHook.on('keydown', event => {
  if (event.keycode === 57419 && canGo(board, currentPiece, 0, -1)) {
    currentPiece.x -= 1;
  } else if (event.keycode === 57421 && canGo(board, currentPiece, 0, 1)) {
    currentPiece.x += 1;
  } else if (event.keycode === 57416 && canRotate(board, currentPiece, true)) {
    currentPiece = currentPiece.rotateLeft();
  } else if (event.keycode === 57424 && canRotate(board, currentPiece, false)) {
    currentPiece = currentPiece.rotateRight();
  }
});

function canGo(board, piece, dy, dx) {
  const newPiece = Object.assign({}, piece, { x: piece.x + dx, y: piece.y + dy });
  return !hasCollision(board, newPiece);
}

function canRotate(board, piece, clockWise) {
  const newPiece = clockWise ? piece.rotateLeft() : piece.rotateRight();
  return !hasCollision(board, newPiece);
}

function hasCollision(board, piece) {
  if (piece.x < 0 || piece.x + piece.width > WIDTH || piece.y < 0 || piece.y + piece.height > HEIGHT) {
    return true;
  }
  for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
    const line = piece.content[lineIndex];
    for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
      const pieceSquare = line[columnIndex];
      if (pieceSquare.color && board[piece.y + lineIndex][piece.x + columnIndex].color) {
        return true;
      }
    }
  }
  return false;
}

ioHook.start();

function generateBoard(width, height) {
  const board = [];
  for (let lineIndex = 0; lineIndex < height; lineIndex++) {
    const line = [];
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      line.push({});
    }
    board.push(line);
  }
  return board;
}

const board = generateBoard(WIDTH, HEIGHT);

function getRandom(min, max) {
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin)) + ceilMin;
}

let delta = 0;
let currentPiece = generateNewPiece();

function generateNewPiece() {
  const random = getRandom(0, 4);

  let piece = null;
  if (random < 1) {
    piece = {
      x: Math.ceil(WIDTH / 2),
      y: 0,
      width: 1,
      height: 4,
      position: 'right',
      left: [
        [{ color: 'yellow' }],
        [{ color: 'yellow' }],
        [{ color: 'yellow' }],
        [{ color: 'yellow' }]
      ],
      right: [
        [{ color: 'yellow' }],
        [{ color: 'yellow' }],
        [{ color: 'yellow' }],
        [{ color: 'yellow' }]
      ],
      up: [
        [{ color: 'yellow' }, { color: 'yellow' }, { color: 'yellow' }, { color: 'yellow' }]
      ],
      down: [
        [{ color: 'yellow' }, { color: 'yellow' }, { color: 'yellow' }, { color: 'yellow' }]
      ],
      rotate(clockWise) {
        let newPiece = Object.assign({}, this);
        if (newPiece.position === 'right') {
          newPiece.x = newPiece.x - 1;
          newPiece.y = newPiece.y + 1;
          if (clockWise) {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          } else {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          }
        } else if (newPiece.position === 'down') {
          newPiece.x = newPiece.x + 1;
          newPiece.y = newPiece.y - 1;
          if (clockWise) {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          } else {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          }
        } else if (newPiece.position === 'left') {
          newPiece.x = newPiece.x - 1;
          newPiece.y = newPiece.y + 1;
          if (clockWise) {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          } else {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          }
        } else if (newPiece.position === 'up') {
          newPiece.x = newPiece.x + 1;
          newPiece.y = newPiece.y - 1;
          if (clockWise) {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          } else {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          }
        }
        [ newPiece.height, newPiece.width ] = [ newPiece.width, newPiece.height ];
        return newPiece;
      },
      rotateRight() {
        return this.rotate(true);
      },
      rotateLeft() {
        return this.rotate(false);
      },
    };
    piece.content = piece[piece.position];
  } else if (random < 2) {
    piece = {
      x: Math.ceil(WIDTH / 2),
      y: 0,
      width: 2,
      height: 3,
      position: 'right',
      left: [
        [{ color: 'orange' }, { color: 'orange' }],
        [{}, { color: 'orange' }],
        [{}, { color: 'orange' }]
      ],
      right: [
        [{ color: 'orange' }, {}],
        [{ color: 'orange' }, {}],
        [{ color: 'orange' }, { color: 'orange' }]
      ],
      up: [
        [{ color: 'orange' }, { color: 'orange' }, { color: 'orange' }],
        [{ color: 'orange' }, {}, {}]
      ],
      down: [
        [{}, {}, { color: 'orange' }],
        [{ color: 'orange' }, { color: 'orange' }, { color: 'orange' }]
      ],
      rotate(clockWise) {
        let newPiece = Object.assign({}, this);
        if (newPiece.position === 'right') {
          newPiece.x = newPiece.x - 1;
          newPiece.y = newPiece.y + 1;
          if (clockWise) {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          } else {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          }
        } else if (newPiece.position === 'down') {
          newPiece.x = newPiece.x + 1;
          newPiece.y = newPiece.y - 1;
          if (clockWise) {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          } else {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          }
        } else if (newPiece.position === 'left') {
          newPiece.x = newPiece.x - 1;
          newPiece.y = newPiece.y + 1;
          if (clockWise) {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          } else {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          }
        } else if (newPiece.position === 'up') {
          newPiece.x = newPiece.x + 1;
          newPiece.y = newPiece.y - 1;
          if (clockWise) {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          } else {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          }
        }
        [ newPiece.height, newPiece.width ] = [ newPiece.width, newPiece.height ];
        return newPiece;
      },
      rotateRight() {
        return this.rotate(true);
      },
      rotateLeft() {
        return this.rotate(false);
      },
    };
    piece.content = piece[piece.position];
  } else if (random < 3) {
    piece = {
      x: Math.ceil(WIDTH / 2),
      y: 0,
      width: 2,
      height: 2,
      position: 'right',
      content: [
        [{ color: 'purple' }, { color: 'purple' }],
        [{ color: 'purple' }, { color: 'purple' }],
      ],
      rotateLeft() {
        return this;
      },
      rotateRight() {
        return this;
      },
    };
  } else if (random < 4) {
    piece = {
      x: Math.ceil(WIDTH / 2),
      y: 0,
      width: 3,
      height: 2,
      position: 'right',
      left: [
        [{ color: 'green' }, { color: 'green' }, { color: 'green' }],
        [{}, { color: 'green' }, {}]
      ],
      right: [
        [{}, { color: 'green' }, {}],
        [{ color: 'green' }, { color: 'green' }, { color: 'green' }]
      ],
      up: [
        [{}, { color: 'green' }],
        [{ color: 'green' }, { color: 'green' }],
        [{}, { color: 'green' }]
      ],
      down: [
        [{ color: 'green' }, {}],
        [{ color: 'green' }, { color: 'green' }],
        [{ color: 'green' }, {}]
      ],
      rotate(clockWise) {
        let newPiece = Object.assign({}, this);
        if (newPiece.position === 'right') {
          if (clockWise) {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          } else {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          }
        } else if (newPiece.position === 'down') {
          if (clockWise) {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          } else {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          }
        } else if (newPiece.position === 'left') {
          if (clockWise) {
            newPiece.content = newPiece.up;
            newPiece.position = 'up';
          } else {
            newPiece.content = newPiece.down;
            newPiece.position = 'down';
          }
        } else if (newPiece.position === 'up') {
          if (clockWise) {
            newPiece.content = newPiece.right;
            newPiece.position = 'right';
          } else {
            newPiece.content = newPiece.left;
            newPiece.position = 'left';
          }
        }
        [ newPiece.height, newPiece.width ] = [ newPiece.width, newPiece.height ];
        return newPiece;
      },
      rotateRight() {
        return this.rotate(true);
      },
      rotateLeft() {
        return this.rotate(false);
      },
    };
    piece.content = piece[piece.position];
  }
  return piece;
}

function print(board, piece) {
  const boardAndPiece = [];
  for (let lineIndex in board) {
    boardAndPiece[lineIndex] = board[lineIndex].slice(0);
  }
  if (piece) {
    for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
      const line = piece.content[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length ; columnIndex++) {
        const pieceSquare = line[columnIndex];
        if (pieceSquare.color) {
          boardAndPiece[piece.y + lineIndex][piece.x + columnIndex] = pieceSquare;
        }
      }
    }
  }
  let result = '';
  for (let lineIndex in boardAndPiece) {
    const line = boardAndPiece[lineIndex];
    for (let columnIndex in line) {
      const square = line[columnIndex];
      result += `|${square.color ? square.color[0] : ' '}`
    }
    result += '|\n';
  }
  console.log(result);
}

function goesDown(piece) {
  piece.y += 1;
}

function transferPieceToBoard(piece, board) {
  for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
    const line = piece.content[lineIndex];
    for (let columnIndex = 0; columnIndex < line.length ; columnIndex++) {
      const pieceSquare = line[columnIndex];
      if (pieceSquare.color) {
        board[piece.y + lineIndex][piece.x + columnIndex] = pieceSquare;
      }
    }
  }
}

function clearLines(board) {
  let lineIndex = board.length - 1;
  while (lineIndex >= 0) {
    const line = board[lineIndex];

    let columnIndex = 0;
    let isFullLine = true;

    while (columnIndex < line.length) {
      if (!board[lineIndex][columnIndex].color) {
        isFullLine = false;
        break;
      }
      columnIndex++;
    }
    if (isFullLine) {
      let replaceLineIndex = lineIndex;
      while (replaceLineIndex > 0) {
        board[replaceLineIndex] = board[replaceLineIndex - 1];
        replaceLineIndex--;
      }
      columnIndex = 0;
      board[0] = [];
      while (columnIndex < board[replaceLineIndex + 1].length) {
        board[0].push({});
        columnIndex++;
      }
      lineIndex++;
    }
    lineIndex--;
  }
}

function update(newDelta, board) {
  delta += newDelta;
  if (delta > 200) {
    delta = 0;
    if (canGo(board, currentPiece, 1, 0)) {
       goesDown(currentPiece);
    } else {
      transferPieceToBoard(currentPiece, board);
      clearLines(board);
      currentPiece = generateNewPiece();
      if (hasCollision(board, currentPiece)) {
        console.log('game over');
        MainLoop.stop();
        process.exit();
      }
    }
  }
}

MainLoop.setUpdate((delta) => update(delta, board));
MainLoop.setDraw(() => print(board, currentPiece));

MainLoop.start();