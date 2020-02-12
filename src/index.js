import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const field = document.querySelector("#field");
  const board = new Board();

  //testing code
  window.board = board;
  window.renderBoard = renderBoard;

  //end test code

  function renderBoard() {
    field.innerHTML = board.getHTML();
  }

  renderBoard();

  //handle clicks on any cell
  field.addEventListener("click", function(event) {
    //Do nothing if target is not a cell
    if (!event.target.classList.contains("cell")) return;

    let coords = event.target.id.split(',');
    board.reveal(Number(coords[0]), Number(coords[1]));
    renderBoard();
  });

  field.addEventListener("contextmenu", function(event) {
    //Do nothing if target is not a cell
    if (!event.target.classList.contains("cell")) return;

    //prevent contextmenu from displaying
    event.preventDefault();

    //flag the target cell
    let coords = event.target.id.split(',');
    board.flagCell(Number(coords[0]), Number(coords[1]));
    renderBoard();
  })
});
