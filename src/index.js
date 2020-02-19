import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const board = new Board(10, 10);

  //DOM elements
  const field = document.querySelector("#field");
  const boardTopper = document.querySelector("#board-topper");
  const tomatoCount = document.querySelector("#tomato-count");
  const blankCount = document.querySelector("#blank-count");
  const newGameSize = document.querySelector("[name=board-size]")
  const newGameTomatoes = document.querySelector("[name=tomato-count]")
  const newGameBtn = document.querySelector("#new-game-btn");
  const newGameModalBtn = document.querySelector("#new-game-modal-btn");
  const resetBtn = document.querySelector("#reset-btn");

  // ==================== Modal Start ====================
  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('#modal-content');
  const modalMessage = document.querySelector("#modal-message");

  const modalSubcontent = {};
  modalSubcontent.gameEnd = document.querySelector('#game-end-modal');
  modalSubcontent.newGameForm = document.querySelector('#new-game-form');

  //Hides the modal and all subcontent
  modalSubcontent.hide = function hide() {
    modal.style.display = "none";
    this.gameEnd.style.display = "none";
    this.newGameForm.style.display = "none";
  };

  //Displays the model with the specified content
  modalSubcontent.show = function show(content) {
    modal.style.display = "block";
    const element = this[content];
    element.style.display = "block";
  };

  //Assign the hide function to all close modal buttons
  const modelCloseBtns = document.querySelectorAll('.close-modal');

  for (let i = 0; i < modelCloseBtns.length; i++) {
    modelCloseBtns[i].onclick = function() {
      modalSubcontent.hide();
    }
  }

  //Close modal when clicking anywhere on the screen outside of the modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modalSubcontent.hide();
    }
  }
  //==================== Modal End ====================

  //testing code
  window.board = board;
  window.update = update;
  window.newGame = newGame;

  //end test code

  update();

  function newGame(size, tomatoCount) {
    board.initialize(size, tomatoCount);
    boardTopper.innerHTML = "Clear the board without squashing any tomatoes";
    update();
  }

  function handleNewGameClick() {
    newGame(newGameSize.value, newGameTomatoes.value);
  }

  newGameModalBtn.onclick = function() {
    modalSubcontent.show("newGameForm");
  }

  function renderBoard() {
    field.innerHTML = board.getHTML();
  }

  function gameOver(won) {
    boardTopper.innerHTML = won ? "You Win!" : "You Lose!";
    modalMessage.innerHTML = won ? "Congratulations, You Win!" : "You Squashed a Tomato!";
    modalSubcontent.show("gameEnd");
  }

  function update() {
    tomatoCount.innerHTML = board.tomatoCount;
    blankCount.innerHTML = board.cellsLeft;

    renderBoard();

    if (board.state != "play") {
      gameOver(board.won());
    }
  }

  //Handle left and right clicks on cells
  function handleCellEvent(event) {
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

      update();
    }
  }

  //Register events
  field.addEventListener("click", handleCellEvent);
  field.addEventListener("contextmenu", handleCellEvent);
  newGameBtn.addEventListener("click", handleNewGameClick);
  resetBtn.addEventListener("click", handleNewGameClick);
});
