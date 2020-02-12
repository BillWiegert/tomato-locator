import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const field = document.querySelector("#field");
  const board = new Board(10);

  //testing code
  window.board = board;
  window.renderBoard = renderBoard;

  //end test code

  function renderBoard() {
    field.innerHTML = board.getHTML();
  }

  renderBoard();

  //Handle left and right clicks on cells
  function handleEvent(event) {
    let target = event.target;

    //Do nothing if target is not a cell
    if (!target.classList.contains("cell")) return;

    if (event.type == "contextmenu") event.preventDefault();

    //Ensure cell is hidden
    if (target.classList.contains("hidden")) {

      //Get cell coordinates
      let coords = target.id.split(',');
      let x = Number(coords[0]);
      let y = Number(coords[1]);

      //Unflag a flagged cell on left or right click
      if (target.classList.contains("flag")) {
        board.unflagCell(x, y)
      } else {
        //Reveal cell on click or flag cell on right click
        event.type == "click" ? board.reveal(x, y) : board.flagCell(x, y);
      }

      renderBoard();
    }
  }

  //Register events
  field.addEventListener("click", handleEvent);
  field.addEventListener("contextmenu", handleEvent);
});
