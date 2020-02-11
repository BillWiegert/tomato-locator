import Cell from "./cell.js";

class Board {
  constructor(size = 10, tomatoes = 10) {
    this.size = size;
    this.tomatoes = tomatoes;
    this.grid = [];
    this.populate();
  }

  populate() {
    this.grid[0] = new Cell("tomato");
  }
}

export default Board;
