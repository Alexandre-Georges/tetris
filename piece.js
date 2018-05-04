

piece = {
  createI() {
    return {
      content: [
        ['yellow'],
        ['yellow'],
        ['yellow'],
        ['yellow']
      ],
      adjustOffset() {
        if (this.direction === 'vertical') {
          this.x = this.x + 1;
          this.y = this.y - 1;
        } else {
          this.x = this.x - 1;
          this.y = this.y + 1;
        }
      },
    };
  },
  createL() {
    return {
      content: [
        ['orange', 'orange'],
        [null, 'orange'],
        [null, 'orange']
      ],
      adjustOffset() {
        if (this.direction === 'vertical') {
          this.x = this.x + 1;
          this.y = this.y - 1;
        } else {
          this.x = this.x - 1;
          this.y = this.y + 1;
        }
      },
    };
  },
  createJ() {
    return {
      content: [
        [null, 'red'],
        [null, 'red'],
        ['red', 'red']
      ],
      adjustOffset() {
        if (this.direction === 'vertical') {
          this.x = this.x + 1;
          this.y = this.y - 1;
        } else {
          this.x = this.x - 1;
          this.y = this.y + 1;
        }
      },
    };
  },
  createO() {
    return {
      content: [
        ['purple', 'purple'],
        ['purple', 'purple'],
      ],
      adjustOffset() {}
    };
  },
  createT() {
    return {
      content: [
        ['green', 'green', 'green'],
        [null, 'green', null]
      ],
      adjustOffset() {}
    };
  },
  createS() {
    return {
      content: [
        ['blue', 'blue', null],
        [null, 'blue', 'blue']
      ],
      adjustOffset() {}
    };
  },
  createZ() {
    return {
      content: [
        [null, 'brown', 'brown'],
        ['brown', 'brown', null]
      ],
      adjustOffset() {}
    };
  },
  generateNewPiece() {
    const random = utils.getRandom(0, 7);
    let piece = null;

    if (random < 1) {
      piece = this.createI();
    } else if (random < 2) {
      piece = this.createL();
    } else if (random < 3) {
      piece = this.createJ();
    } else if (random < 4) {
      piece = this.createO();
    } else if (random < 5) {
      piece = this.createT();
    } else if (random < 6) {
      piece = this.createS();
    } else if (random < 7) {
      piece = this.createZ();
    }

    piece.x = Math.ceil(WIDTH / 2);
    piece.y = 0;
    piece.direction = 'vertical';

    return piece;
  }
};