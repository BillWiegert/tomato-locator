/*
Bill Wiegert
CMPT304
Assignment #2
02-21-2020

Tested in Chrome, Safari, and Firefox
Bundled into dist/main.js with webpack
*/

class Cell {
  constructor(coords, type = "empty") {
    this.coords = coords;
    this.type = type;
    this.hidden = true;
    this.flag = false;
    this.tomatoCount = 0;
  }

  // Returns true if the cell is a tomato, false otherwise
  isTomato() {
    return this.type == "tomato";
  }

  // Returns true if the cell is flagged, false otherwise
  isFlagged() {
    return this.flag;
  }

  // Sets hidden and flag to false and updates tomatoCount
  reveal(tomatoCount) {
    this.tomatoCount = tomatoCount
    this.hidden = false;
    this.flag = false;
  }

  // Determines the value to be displayed in the cell
  displayVal() {
    return (this.type == "empty" && !this.hidden && this.tomatoCount > 0) ? this.tomatoCount : "";
  }

  // Returns the HTML representation of the cell
  getHTML() {
    return `<div id=${this.coords.join()} class="cell ${this.hidden ? "hidden" : this.type} ${this.flag ? "flag" : ""}">${this.displayVal()}</div>`;
  }
}

export default Cell;
