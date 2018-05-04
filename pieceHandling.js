pieceHandling = {
  canGo(board, piece, dy, dx) {
    const newPiece = Object.assign({}, piece, { x: piece.x + dx, y: piece.y + dy });
    return !this.hasCollision(board, newPiece);
  },
  rotate(clockWise, piece) {
    if (clockWise) {
      this.rotateRight(piece);
    } else {
      this.rotateLeft(piece);
    }
    piece.direction = piece.direction === 'vertical' ? 'horizontal' : 'vertical';
    piece.adjustOffset();
  },
  rotateLeft(piece) {
    const newContent = [];
    for (let j = piece.content[0].length - 1; j >= 0; j--) {
      const line = [];
      newContent.push(line);
      for (let i = 0; i < piece.content.length; i++) {
        line.push(piece.content[i][j]);
      }
    }
    piece.content = newContent;
  },
  rotateRight(piece) {
    const newContent = [];
    for (let j = 0; j < piece.content[0].length; j++) {
      const line = [];
      newContent.push(line);
      for (let i = piece.content.length - 1; i >= 0; i--) {
        line.push(piece.content[i][j]);
      }
    }
    piece.content = newContent;
  },
  canRotate(board, piece, clockWise) {
    let newPiece = Object.assign({}, piece);
    this.rotate(clockWise, newPiece);

    return !this.hasCollision(board, newPiece);
  },
  hasCollision(board, piece) {
    if (piece.x < 0 || piece.x + piece.content[0].length > WIDTH || piece.y < 0 || piece.y + piece.content.length > HEIGHT) {
      return true;
    }
    for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
      const line = piece.content[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        const pieceSquare = line[columnIndex];
        if (pieceSquare && board[piece.y + lineIndex][piece.x + columnIndex]) {
          return true;
        }
      }
    }
    return false;
  },
  goesDown(piece) {
    piece.y += 1;
  },
  transferPieceToBoard(piece, board) {
    for (let lineIndex = 0; lineIndex < piece.content.length; lineIndex++) {
      const line = piece.content[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length ; columnIndex++) {
        const pieceSquare = line[columnIndex];
        if (pieceSquare) {
          board[piece.y + lineIndex][piece.x + columnIndex] = pieceSquare;
        }
      }
    }
  }
};
