import Cell from "./cell.js";

class Board {
  constructor(size = 10, tomatoes = 10) {
    this.size = size;
    this.tomatoes = tomatoes;
    this.populate();
  }

  populate() {
    this.grid = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        let type = Math.random() > 0.95 ? "tomato" : "empty";
        this.grid[i][j] = new Cell([i,j], type);
      }
    }
  }

  //checks if the given coordinate pair is within the grid
  inbounds(x, y) {
    return (x >= 0 && x < this.size && y >= 0 && y < this.size);
  }

  getCell(x, y) {
    return this.grid[x][y];
  }

  //returns an array of cells that are neighbors of the cell at the given coordinate
  getNeighbors(x, y) {
    //return nothing if specified coordinates are not within the grid
    if (!this.inbounds(x, y)) return;
    let neighbors = [];

    //iterate from -1 to 1 in both x and y to get all neighbors
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        //skip iteration for the originally specified cell
        if (i == 0 && j == 0) continue;
        //skip iteration for positions that are not within the grid
        if (!this.inbounds(x + i, y + j)) continue;
        neighbors.push(this.grid[x + i][y + j]);
      }
    }
    return neighbors;
  }

  getTomatoCount(x, y) {
    let count = 0;
    let neighbors = this.getNeighbors(x, y);

    neighbors.forEach((cell) => {
      if (cell.isTomato()) count++;
    });

    return count;
  }

  reveal(x, y) {
    let cell = this.getCell(x, y);

    if (!cell.hidden) return;
    //add lose condition if tomato

    let count = this.getTomatoCount(x, y);
    cell.reveal(count);
    if (count == 0) {
      this.getNeighbors(x, y).forEach((c) => {
        this.reveal(c.coords[0], c.coords[1]);
      });
    }
  }

  flagCell(x, y) {
    this.getCell(x, y).flag = true;
  }

  unflagCell(x, y) {
    this.getCell(x, y).flag = false;
  }

  getHTML() {
    let result = "";

    this.grid.forEach((row) => {
      result += "<div class='row'>";
      row.forEach((cell) => {
        result += cell.getHTML();
      });
      result += "</div>";
    });

    return result;
  }
}

export default Board;
