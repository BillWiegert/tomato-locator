class Cell {
  constructor(coords, type = "empty") {
    this.coords = coords;
    this.type = type;
    this.hidden = true;
    this.flag = false;
    this.tomatoCount = 0;
  }

  isTomato() {
    return this.type == "tomato";
  }

  isFlagged() {
    return this.flag;
  }

  reveal(tomatoCount) {
    this.tomatoCount = tomatoCount
    this.hidden = false;
    this.flag = false;
  }

  displayVal() {
    return (this.type == "empty" && !this.hidden && this.tomatoCount > 0) ? this.tomatoCount : "";
  }

  getHTML() {
    return `<div id=${this.coords.join()} class="cell ${this.hidden ? "hidden" : this.type} ${this.flag ? "flag" : ""}">${this.displayVal()}</div>`;
  }
}

export default Cell;
