/*
Bill Wiegert
CMPT304
Assignment #2
02-21-2020

Tested in Chrome, Safari, and Firefox
Bundled into dist/main.js with webpack
*/

import Board from "./board.js";

//Ensure DOM content has loaded before executing any code
document.addEventListener("DOMContentLoaded", function(event) {
  const BOARD = new Board(10, 10);

  //DOM elements
  const field = document.querySelector("#field");
  const boardTopper = document.querySelector("#board-topper");
  const tomatoCount = document.querySelector("#tomato-count");
  const blankCount = document.querySelector("#blank-count");
  const newGameSize = document.querySelector("[name=board-size]");
  const newGameTomatoes = document.querySelector("[name=tomato-count]");
  const newGameModalBtn = document.querySelector("#new-game-modal-btn");
  const newGameBtns = document.querySelectorAll(".new-game-btn");

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

  //Close modal when clicking anywhere on the screen outside of the modal content
  modal.onclick = function(event) {
    // modal is the background of the modal content
    if (event.target == modal) {
      modalSubcontent.hide();
    }
  }
  //==================== Modal End ====================

  // ===== testing code =====
  // window.BOARD = BOARD;
  // window.update = update;
  // window.newGame = newGame;

  // Starts a new game with the specified settings
  function newGame(size, tomatoCount) {
    BOARD.newGame(size, tomatoCount);
    boardTopper.innerHTML = "Clear the board without squashing any tomatoes";
    modal.classList.remove("modal-win");
    update();
  }

  // Handles the clicking of a new game button
  function handleNewGameClick() {
    newGame(newGameSize.value, newGameTomatoes.value);
  }

  // Shows new game modal
  newGameModalBtn.onclick = function() {
    modalSubcontent.show("newGameForm");
  }

  // Renders the board state on the page
  function renderBoard() {
    field.innerHTML = BOARD.getHTML();
  }

  // Handles end of game actions
  function gameOver(won) {
    boardTopper.innerHTML = won ? "You Win!" : "You Lose!";
    modalMessage.innerHTML = won ? "Congratulations, You Win!" : "You Squashed a Tomato!";
    won ? modal.classList.add("modal-win") : modal.classList.remove("modal-win");
    modalSubcontent.show("gameEnd");
  }

  // Handles required updates after board state changes
  function update() {
    tomatoCount.innerHTML = BOARD.tomatoCount - BOARD.numFlagged;
    blankCount.innerHTML = BOARD.cellsLeft;

    renderBoard();

    if (BOARD.state != "play") {
      gameOver(BOARD.won());
    }
  }

  //Handle clicks on cells
  function handleCellEvent(event) {
    let target = event.target;

    //Do nothing if target is not a cell
    if (!target.classList.contains("cell")) return;

    if (event.type == "contextmenu") event.preventDefault();

    //Get cell coordinates as integers
    let coords = target.id.split(',');
    let x = Number(coords[0]);
    let y = Number(coords[1]);

    if (target.classList.contains("hidden")) {
      //Unflag a flagged cell on left or right click
      if (target.classList.contains("flag")) {
        BOARD.unflagCell(x, y)
      } else {
        //Reveal cell on click or flag cell on right click
        event.type == "click" ? BOARD.reveal(x, y) : BOARD.flagCell(x, y);
      }

      update();
    } else if (event.type == "dblclick") {
      // Reveal neighbors on double click of an already revealed cell
      BOARD.revealUnflaggedNeighbors(x, y);
      update();
    }
  }

  //Register events
  field.addEventListener("click", handleCellEvent);
  field.addEventListener("contextmenu", handleCellEvent);
  field.addEventListener("dblclick", handleCellEvent);
  newGameBtns.forEach((btn) => {
    btn.addEventListener("click", handleNewGameClick);
  });

  //Initial update
  update();
});
