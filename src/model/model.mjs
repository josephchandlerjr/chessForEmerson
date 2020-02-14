
const startState = "brbnbbbqbkbbbnbr--bpbpbpbpbpbpbpbp--0000000000000000--0000000000000000--0000000000000000--0000000000000000--wpwpwpwpwpwpwpwp--wrwnwbwqwkwbwnwr";
let states;
let moves;
let board;
let control;
let capturedPieces;

/**
* Sets initial state variables
* @param {Object} obj Control object in MVC
*/
function init(obj){
  control = obj;
  board = {};
  moves = [];
  capturedPieces = [];
  states = [];
  states.push(startState);
  let ix = 0;
  for (let rank=8; rank > 0; rank--) {
    for (let file=0; file < 8; file++){
      let fileLetter = "abcdefgh".charAt(file);
      let rep = startState.slice(ix,ix+2);
      if (rep === "--") {ix+= 2; rep = startState.slice(ix,ix+2);}
      board[fileLetter + rank] = startState.slice(ix,ix+2);
      ix += 2;
    }
  }
}

/**
* update capturedPieces
* @param {String} piece piece captured
*/
function updateCapturedPieces(piece){
  if (piece !== "00"){
    capturedPieces.push(piece);
  }
}
/**
* returns a copy of the board as an array using slice
* @return {Array} copy of board as an array
*/
function getBoard(){
  return Object.assign({}, board);
}

/**
* return array of Move objects
* @return {Array} an array of Move objects
*/
function getMoves(){
  return moves;
}

/**
* pushes Move object onto moves
* @param {Object} move a Move objects
*/
function logMove(move){
  moves.push(move);
}

function updateBoard(newBoard){
  board = newBoard;
}

/**
* returns string representation of board
* @return {String} string representing board
*/
function toString(){
  let result = "", piece = 0;
  for (let rank=8; rank > 0; rank--) {
    for (let file=0; file < 8; file++){
      let fileLetter = "abcdefgh".charAt(file);
      piece = board[fileLetter + rank];
      result += piece;
    }
    result += "--"
  }
  return result.slice(0,-2);
}

export const chessModel = {   // *****Public Methods*****
  toString,
  getBoard,
  init,
  logMove,
  getMoves,
  updateBoard,
  updateCapturedPieces
};

