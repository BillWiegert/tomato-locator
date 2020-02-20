import Cell from "./cell.js";

class Board {
  constructor(size = 10, tomatoCount = 10) {
    this.initialize(size, tomatoCount);
  }

  //Fill grid with cells
  initialize(size, tomatoCount) {
    this.tomatoes = [] //Array containing all tomato cells
    this.size = size;
    let numCells = size * size;
    //Ensure that the number of tomatoes is at most one less than the number of cells
    this.tomatoCount = tomatoCount >= numCells ? numCells - 1 : tomatoCount;
    this.cellsLeft = numCells - this.tomatoCount; //Number of empty cells that are still hidden
    this.state = "play"; //play, won, lost

    this.grid = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = new Cell([i,j]);
      }
    }

    //Add tomatoes to random spots
    for (let i = 0; i < this.tomatoCount; i++) {
      let cell;
      //Ensure the cell is not already a tomato
      do {
        let x = Math.floor(Math.random()*this.size);
        let y = Math.floor(Math.random()*this.size);
        cell = this.grid[x][y];
      }
      while (cell.type == "tomato")

      cell.type = "tomato";
      this.tomatoes.push(cell);
    }
  }

  //checks if the given coordinate pair is within the grid
  inbounds(x, y) {
    return (x >= 0 && x < this.size && y >= 0 && y < this.size);
  }

  getCell(x, y) {
    return this.grid[x][y];
  }

  // returns an array of the coordinates of a cells neighbors
  getNeighborCoords(x, y) {
    //return nothing if specified coordinates are not within the grid
    if (!this.inbounds(x, y)) return;
    let coordList = [];

    //iterate from -1 to 1 in x and y directions
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        //skip iteration for the originally specified coordinates
        if (i == 0 && j == 0) continue;
        //skip iteration for positions that are not within the grid
        if (!this.inbounds(x + i, y + j)) continue;
        coordList.push([x + i, y + j]);
      }
    }

    return coordList;
  }

  //returns an array of cells that are neighbors of the cell at the given coordinate
  getNeighbors(x, y) {
    //return nothing if specified coordinates are not within the grid
    if (!this.inbounds(x, y)) return;
    let neighbors = [];
    let coordList = this.getNeighborCoords(x, y);

    coordList.forEach((coord) => {
      neighbors.push(this.getCell(coord[0], coord[1]));
    });

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

    if (cell.isTomato() && this.state == "play") {
      this.lose();
      return;
    }

    let count = this.getTomatoCount(x, y);
    cell.reveal(count);
    if (this.state == "play") {
      this.cellsLeft--;
      if (this.cellsLeft == 0) this.win();
    }

    if (count == 0) {
      this.getNeighbors(x, y).forEach((c) => {
        this.reveal(c.coords[0], c.coords[1]);
      });
    }
  }

  // Reveal all neighbors of a revealed cell that are not flagged
  revealUnflaggedNeighbors(x, y) {
    let neighbors = this.getNeighborCoords(x, y);

    neighbors.forEach((coord) => {
      let x = coord[0];
      let y = coord[1];

      // Don't reveal flagged cells
      if (!this.getCell(x, y).isFlagged()) {
        this.reveal(x, y);
      }
    });
  }

  //Reveal every cell
  revealAll() {
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        this.reveal(cell.coords[0], cell.coords[1]);
      });
    });
  }

  //Change the game state to lost and reveal all cells
  lose() {
    this.state = "lost";
    this.revealAll();
  }

  //Change game state to won, reveal all cells and change each tomato to tomato-win
  win() {
    this.state = "won";
    this.revealAll();
    this.tomatoes.forEach((tomato) => {
      tomato.type = "tomato-win";
    });
  }

  lost() {
    return this.state == "lost";
  }

  won() {
    return this.state == "won";
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
