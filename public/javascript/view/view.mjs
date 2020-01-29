
let lastClicked = null, control, destinations, destSquare;
const board = document.querySelector("#board-container");
const squares = board.querySelectorAll(".square");
const status = document.querySelector("#status");
/**
* listener for div elements that make up chess board
* @param {Event} evt
*/
function mouseDown(evt){
  evt.preventDefault();
  let target = evt.target.tagName === "IMG" ? evt.target.parentNode : evt.target;
  let id = target.id;
  let destinationsAttr = target.getAttribute("destinations");
  if (!target.classList.contains("square") || destinationsAttr === "" ){ return;}
  board.classList.add("grabbed");
  lastClicked = target;
  lastClicked.classList.add("selected");
  destinations = destinationsAttr.split(" ");
  for (let i=0; i < destinations.length; i++){
    destSquare = board.querySelector("#"+destinations[i]);
    destSquare.classList.add("target");
  }
}
/**
* listener for div elements that make up chess board
* @param {Event} evt
*/
function mouseUp(evt){
  evt.preventDefault();
  board.classList.remove("grabbed");
  if (!destinations) {return;}
  let target = evt.target.tagName === "IMG" ? evt.target.parentNode : evt.target;
  let id = target.id;
  for (let i=0; i < destinations.length; i++){
    destSquare = board.querySelector("#"+destinations[i]);
    destSquare.classList.remove("target");
  }
  if (lastClicked !== null){
    lastClicked.classList.remove("selected");
    control.viewRequest({ request : "move",
                          from : lastClicked.id,
                          to : id});
    lastClicked = null;
  }
}

/**
* listener for div elements that make up chess board
* @param {Event} evt
*/
function mouseLeave(evt){
  board.classList.remove("grabbed");
  lastClicked = null;
  let squares = board.querySelectorAll(".square");
  for (let i=0; i < squares.length; i++){
    squares[i].classList.remove("target");
    squares[i].classList.remove("selected");
  }
}

/**
* rotate the board and each square 180deg by adding appropriate class
*/
function flipBoard(){
  if(board.classList == ""){
    board.classList.add("flipped-board");
    squares.forEach(sqr => sqr.classList.add("flipped-board"));
  } else {
    board.classList.toggle("flipped-board");
    board.classList.toggle("unflipped-board");
    squares.forEach(sqr => {
      sqr.classList.toggle("flipped-board");
      sqr.classList.toggle("unflipped-board");
    });
  }
}

/**
* rest board. Listener for reset button
*/
function reset(){
  control.viewRequest({request: "reset"});
}

/**
* asks control object to set automation config
* @param {Event} event
*/
function onChangeOfAutomationSelection(evt){
  if (evt){
    control.viewRequest({request:"automate", color:evt.target.name});
  }
}

function makeBoardDiv(){
  let div = document.createElement("div");
  div.classList.add("flippable");
  return div;
}

/**
* Sets control variable, adds listeneres, calls update
* @param {Object} obj Control object in MVC
*/
function init(obj){
  control = obj;
  let resetButton = document.querySelector("#reset");
  if (resetButton) resetButton.addEventListener("click",reset);
  let dropdowns = document.querySelectorAll(".dropdown-item");
  for (let item of dropdowns) item.addEventListener("click", evt => onChangeOfAutomationSelection(evt));
  board.addEventListener("mouseup",mouseUp,false); // during bubbling phase
  board.addEventListener("touchend",mouseUp,false); // during bubbling phase
  board.addEventListener("mousedown",mouseDown,false);
  board.addEventListener("toushstart",mouseDown,false);
  board.addEventListener("mouseleave",mouseLeave,false);

  let flipButton = document.querySelector("#flip");
  flipButton.addEventListener("click",flipBoard);
  update();
}

/*
* Gets board from Control object and sets innerHTML of divs representing squares
*/
function update(){
  let squares = board.querySelectorAll(".square");
  let rep = control.getBoardAsString();
  let sqr = 0;
  for (let i=0;i<rep.length;i+=2){
    if (rep[i] !== "-"){
      let img = squares[sqr].querySelector("img");
      img.setAttribute("style", "");
      switch(rep.substring(i,i+2)) { // **********
        case "00": img.setAttribute("style", "display:none;"); break;
        case "bp": img.setAttribute("src","images/blackPawn.svg"); break;
        case "br": img.setAttribute("src","images/blackRook.svg"); break;
        case "bn": img.setAttribute("src","images/blackKnight.svg"); break;
        case "bb": img.setAttribute("src","images/blackBishop.svg"); break;
        case "bq": img.setAttribute("src","images/blackQueen.svg"); break;
        case "bk": img.setAttribute("src","images/blackKing.svg"); break;

        case "wp": img.setAttribute("src","images/whitePawn.svg"); break;
        case "wr": img.setAttribute("src","images/whiteRook.svg"); break;
        case "wn": img.setAttribute("src","images/whiteKnight.svg"); break;
        case "wb": img.setAttribute("src","images/whiteBishop.svg"); break;
        case "wq": img.setAttribute("src","images/whiteQueen.svg"); break;
        case "wk": img.setAttribute("src","images/whiteKing.svg"); break;
      }
      let squareID = squares[sqr].id;
      let destinations = control.viewRequest({request: "validMoves", from: squareID});
      squares[sqr].setAttribute("destinations", Object.keys(destinations).join(" "));
      sqr += 1;
    }
  }
  let statusObj = control.viewRequest({ request : "status"});
  let colorToMove = statusObj.colorToMove;
  let gameOver = statusObj.gameOver;
  let isCheckmate = statusObj.isCheckmate;
  if (!gameOver){
    let fullColorName = colorToMove === "w" ? "White" : "Black";
    setStatus(fullColorName + " to move.")
  } else if (isCheckmate){
    setStatus("Checkmate!");
  } else {
    setStatus("Draw!");
  }
}

function setStatus(msg) {
  status.textContent = msg;
}


export const chessView = { // *****Public Methods*****
  update,
  init,
  setStatus
};
