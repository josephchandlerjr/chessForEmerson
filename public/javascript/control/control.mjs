import { getAllSquares, getAllSquarePairings } from './utils/squares.mjs'

let model, view, self;
let colorToMove, lastMove, canCastle, whiteInCheck, blackInCheck;
let gameOver;
let isCheckmate;
let automated = {"b": true, "w": false};
let movesMap = {};

const allSquares = getAllSquares();
const allSquarePairings = getAllSquarePairings(allSquares);
const adjacentSquares = {};

// live game stuff

let live, myColor, socket;

function makeLive() {
  live = true;
}

function startLiveGame(sock, col) {
  socket = sock
  myColor = col
}


/**
* initializes state variables
* @param {Object} mObj Model Object
* @param {Object} vObj View Object
*/
function start(mObj, vObj){
  model = mObj;
  view = vObj;
  self = this // when invoked from exported object, this refers to that object. store as 'self' so we can pass to view and model objects
  init();
}

function init(){
  gameOver = false;
  isCheckmate = false;
  lastMove = new Move("00","00","00","00","00","00");
  canCastle = {
    w : {queenside: true, kingside: true},
    b : {queenside: true, kingside: true}
  };
  whiteInCheck = false;
  blackInCheck = false;
  for (let sqr=0; sqr < allSquares.length;sqr++){
    let thisSqr = allSquares[sqr];
    adjacentSquares[thisSqr] = {};
    adjacentSquares[thisSqr].n = getAdjacentSquare(thisSqr,"n");
    adjacentSquares[thisSqr].ne = getAdjacentSquare(thisSqr,"ne");
    adjacentSquares[thisSqr].e = getAdjacentSquare(thisSqr,"e");
    adjacentSquares[thisSqr].se = getAdjacentSquare(thisSqr,"se");
    adjacentSquares[thisSqr].s = getAdjacentSquare(thisSqr,"s");
    adjacentSquares[thisSqr].sw = getAdjacentSquare(thisSqr,"sw");
    adjacentSquares[thisSqr].w = getAdjacentSquare(thisSqr,"w");
    adjacentSquares[thisSqr].nw = getAdjacentSquare(thisSqr,"nw");
  }
  model.init(self);
  toggleColorToMove("w");
  if (automated[colorToMove]){
    updateMovesMap();
    makeAutoMove();
  }
  updateMovesMap();
  view.init(self);
}

/**
* update movesMap with current board configuration
*/
function updateMovesMap(){
  for (let i=0; i < allSquares.length; i++){
    movesMap[allSquares[i]] = {};
  }
  let validMoves = getAllValidMoves(getBoard());
  for (let color in validMoves){
    for (let i=0; i < validMoves[color].length; i++){
      let moveObj = validMoves[color][i];
      if (!(moveObj.toSquare in movesMap[moveObj.fromSquare])) {
        movesMap[moveObj.fromSquare][moveObj.toSquare] = moveObj;
      }
    }
  }
  movesMap.all = validMoves;
}

/**
* @param {Object} request request.request will describe action requested
*/
function viewRequest({request, color, from, to}){
  //if live can only move my own piece
  //if(live && myColor !== color) return false



  if (request === "status"){
    return {colorToMove: colorToMove,
            gameOver: gameOver,
            isCheckmate: isCheckmate
          };
  }
  if (request === "reset"){
    init();
  }
  if (gameOver) {
    return false;
  }
  if (request === "move"){
    console.log(myColor)
    console.log(getPieceOnSquare(from, getBoard()))
    if(live && myColor[0] !== getPieceOnSquare(from, getBoard())[0]) {
      console.log('hi')
      return false
    }
    let executed = requestMove(from, to);
    if (executed) {
      if (live) {
        return socket.emit('move', {request, color, from, to})
      }
      if (automated[colorToMove] && !gameOver){
        makeAutoMove();
      }
    }
  }

  if (request === "automate"){
    switch (color){
      case "none" : automated.b = false; automated.w = false; break;
      case "white": automated.b = false; automated.w = true; break;
      case "black": automated.b = true; automated.w = false; break;
    }
    if (automated[colorToMove]){
      makeAutoMove();
    }
  }

  if (request === "validMoves"){
    return movesMap[from];
  }
}
/**
* gets all valid moves for both colors
* @param board array of arrays
* @return {Object} object with two properties, white and black containing valid moves for each color
*/
function getAllValidMoves(board){
  let result = {}, blackResults = [], whiteResults = [];
  let fromToPairs = allSquarePairings;
  fromToPairs.forEach(function(pair){
    let whiteMove = isvalidMovement(pair, "w", board);
    if (whiteMove){
      whiteResults.push(whiteMove);
    } else {
      let blackMove = isvalidMovement(pair, "b", board);
      if (blackMove){
        blackResults.push(blackMove);
    }
  }
  });
  result.b = removeMovesThatEndangerKing("b", blackResults, board);
  result.w = removeMovesThatEndangerKing("w", whiteResults, board);
  return result
}

/**
* filters our moves that endanger own king
* @param {String} colorToMove
* @param {Array} validMoves array of Move objects
* @param {Array} board array of arrays
* @return {Array} array of Move objects
*/
function removeMovesThatEndangerKing(colorToMove, validMoves, board){
  let result = [];
  let opponentsColor = otherColor(colorToMove);
  for (let i=0; i < validMoves.length; i++){
    let testingBoard = copyBoard(board);
    let thisMove = validMoves[i];
    movePiece(thisMove.fromSquare, thisMove.toSquare, thisMove.captureSquare, testingBoard);
    let newValidMovesForOpponent = getAllValidMovementsByColor(opponentsColor, testingBoard);
    let newThreatenedSquares = getThreatenedSquares(newValidMovesForOpponent, testingBoard);
    let colorToMoveKingLocation = findKing(colorToMove, testingBoard);
    if (newThreatenedSquares.includes(colorToMoveKingLocation)){
      continue;
    }
    if(thisMove.special !== null && thisMove.special.description == "castle"){
      // check if square to left/right is threatened
      let direction = thisMove.special.direction === "queenside" ? "w" : "e";
      if (newThreatenedSquares.includes(thisMove.fromSquare) ||
          newThreatenedSquares.includes(getSquare(thisMove.fromSquare, direction)) ||
          newThreatenedSquares.includes(getSquare(thisMove.fromSquare, [direction,direction]))){
            continue;
          }
    }
    result.push(thisMove);
  }
  return result;
}

/**
* calls getAllValidMovementsByColor and randomly selects one using Math.random()
* @param {String} activeColor color to move
* @param {Array} board array of arrays
* @return {Object} a Move object
*/
function getRandomMove(activeColor, board){
  let validMoves = getAllValidMovementsByColor(activeColor, board);
  let rand = Math.floor(Math.random() * (validMoves.length));
  return validMoves[rand];
}

/**
* toggles between "w" and "b" or "black" and "white"
@param {string} color
@return {string} toggled color
*/
function otherColor(color){
  let result;
  if (color.length > 1){
    result = color === "white" ? "black" : "white";
  } else {
    result = color === "w" ? "b" : "w";
  }
  return result;
}

/**
* updates canCastle variable based on a move object
* @param {Object} move a Move object
*/
function updateCanCastle(move){
  let piece = move.pieceMoved, square = move.fromSquare;
  let pieceColor = piece[0], pieceKind = piece[1];

  if (pieceKind === "k"){
    canCastle[pieceColor].queenside = false;
    canCastle[pieceColor].kingside = false;
  }
  if (pieceKind === "r"){
    if(square[0] === "a"){
      canCastle[pieceColor]["queenside"] = false;
    }
    if(square[0] === "h"){
      canCastle[pieceColor]["kingside"] = false;
    }
  }
  // what if rook is captured, not moved
  if (move.toSquare === "a1"){
    canCastle.w.queenside = false;
  }
  if (move.toSquare === "h1"){
    canCastle.w.kingside = false;
  }
  if (move.toSquare === "a8"){
    canCastle.b.queenside = false;
  }
  if (move.toSquare === "h8"){
    canCastle.b.kingside = false;
  }
}

/**
* creates move object to be logged
* @param {String} fromSquare chessnotation showing from square
* @param {String} toSquare chessnotation showing to square
* @param {String} captureSquare chessnotation showing capture square
* @param {String} pieceMoved string representing piece moved
* @param {String} pieceCaptured string representing piece captured
* @param {String} special object with special move information
*/
function Move(fromSquare, toSquare, captureSquare, pieceMoved, pieceCaptured,special){
  this.fromSquare = fromSquare;
  this.toSquare = toSquare;
  this.captureSquare = captureSquare;
  this.pieceMoved = pieceMoved;
  this.pieceCaptured = pieceCaptured;
  this.special = special;
}

/**
* toggles colorToMove between "w" and "b"
* if called with an argument, colorToMove will be assigned that argument
* @param {String} color color you with to be assigned to colorToMove
*/
function toggleColorToMove(color){
  if (!color){
    colorToMove = otherColor(colorToMove);
  } else {
    colorToMove = color;
  }
}

/**
* calls requestMove with random move
*/
function makeAutoMove(){
  let currentBoard = getBoard();
  let activeColor = colorToMove;
  let result = false;
  while (!result){
    let moveObject = getRandomMove(activeColor, currentBoard);
    result = requestMove(moveObject.fromSquare, moveObject.toSquare);
  }
}

/**
* retrieves board information from Model
* @return {String} board state as a string
*/
function getBoardAsString(){
  return model.toString();
}

/**
* move piece on a board
* @param {String} from from square in chess notation
* @param {String} to to square in chess notation
* @param {Array} board array of arrays representing the getBoard
* @return {Array} new state of the board
*/
function movePiece(from, to, captureSquare, board){  // example C2 to C4
  let piece = board[from];
  board[from] = "00";
  board[to] = piece;
  if (captureSquare !== null && captureSquare !== to){ // really only true for pawns
    board[captureSquare] = "00";
  }
  return board;
}

/**
* return deep copy of the getBoard
* @param {Array} board array of arrays
* @return {Array} deep copy of board array
/*/
function copyBoard(board){
  return Object.assign({},board);
}

/**
* find squares that are under threat
* @param {Array} moves an array of move objects
* @param {Array} board an array of arrays
* @return {Array} array of strings representing threatened squares on board
*/
function getThreatenedSquares(moves, board){
  let result = moves.map(function(obj){
    if (obj.captureSquare != null){
      return obj.captureSquare;
    }});
  // now include all squares NE or NW of white pawns and
  // SE or SW of black pawns
  for (let sqr in board){
    let piece = board[sqr];
    if (piece[1] === "p"){
      if (piece[0] === "w"){
        result.push(getSquare(sqr, "nw"));
        result.push(getSquare(sqr, "ne"));
      }
      if (piece[0] === "b"){
        result.push(getSquare(sqr, "sw"));
        result.push(getSquare(sqr, "se"));
      }
    }
  }
// remove null from list
result = result.filter(x => x != null);
return result;
}

/**
* determines if move is valid and if so executes moves
* @param {String} from square moving piece from in in chess notation
* @param {String} to square moving piece to in in chess notation
* @return {Boolean} true if move executed else false;
*/
function requestMove(from, to){
  // who's who
  let activeColor = colorToMove;
  let opponentsColor = otherColor(activeColor);
  let currentBoard = getBoard();

  // get a list of valid Move objects for activeColor
  // see if requested move is in that list
  let validMovesforActiveColor = movesMap.all[activeColor];
  let validMovement = false; //
  let thisMove;
  for (let i=0; i < validMovesforActiveColor.length; i++){
    thisMove = validMovesforActiveColor[i];
    if(thisMove.fromSquare === from && thisMove.toSquare === to){
      validMovement = true;
      break;
    }
  }
  // if we found requested move in the list of valid move objects
  // make that move on a copy of the board
  if (validMovement){
    let newBoard = copyBoard(currentBoard);
    newBoard = movePiece(from, to, thisMove.captureSquare, newBoard);

    if (thisMove.special !== null){
      if (thisMove.special.description == "castle"){
        let rookLocation =  thisMove.special.direction === "queenside"? "a"+from[1] : "h"+from[1];
        let rookDirection = thisMove.special.direction === "queenside" ? "e" : "w";
        let rookTo = getSquare(to,rookDirection);
        newBoard = movePiece(rookLocation, rookTo, null, newBoard);
      }
      if (thisMove.special.description == "promotion"){
        newBoard[thisMove.toSquare] = thisMove.special.promoteTo;
      }
    }

    updateModel(thisMove, newBoard);
    lastMove = thisMove;
    updateCanCastle(thisMove);

    // let's see if its checkmate or stalemate
    let newValidMovesForOpponent = getAllValidMovementsByColor(opponentsColor, newBoard);
    let opponentsKingLocation = findKing(opponentsColor, newBoard);
    let newValidMovesForActiveColor = getAllValidMovementsByColor(activeColor, newBoard);
    let activeColorNowThreatens = getThreatenedSquares(newValidMovesForActiveColor, newBoard);
    gameOver = noLegalMoves(opponentsColor, newValidMovesForOpponent, newBoard);
    if (gameOver){
      isCheckmate = activeColorNowThreatens.includes(opponentsKingLocation);
    }
    toggleColorToMove();
    updateMovesMap();
    view.update();
  }
  return validMovement;
}

/**
* Evaluate if a color is in checkmate on a particular board based on valid moves
* @param {String} colorToMove
* @param {Array} validMoves array of Move objects
* @param {Array} board array of arrays
*/
function noLegalMoves(colorToMove, validMoves, board){
  let opponentsColor = otherColor(colorToMove);
  for (let i=0; i < validMoves.length; i++){
    let testingBoard = copyBoard(board);
    let thisMove = validMoves[i];
    movePiece(thisMove.fromSquare, thisMove.toSquare, thisMove.captureSquare, testingBoard);
    let newValidMovesForOpponent = getAllValidMovementsByColor(opponentsColor, testingBoard);
    let newThreatenedSquares = getThreatenedSquares(newValidMovesForOpponent, testingBoard);
    let colorToMoveKingLocation = findKing(colorToMove, testingBoard);
    if (!newThreatenedSquares.includes(colorToMoveKingLocation)){
      return false;
    }
  }
  return true;
}

/**
* update the model
* @param {Object} move a move object
* @param {Array} board array of arrays
*/
function updateModel(move, board){
  model.logMove(move);
  model.updateBoard(board);
  model.updateCapturedPieces(move.pieceCaptured);
}

/**
* gets current state of board as an Array
* @return {Array} array of arrays representing board
*/
function getBoard(){
  return model.getBoard();
}

/**
* get all moves that are valid based on movement of piece
* with no regard for check status
* @param {String} color color of pieces to move
* @param {Array} board to evaluate
* @return {Array} array of move objects
*/
function getAllValidMovementsByColor(color,board){
  // simply returns movements that look proper without thought of check status
  // and don't worry about special moves yet.
  let result = [];
  let fromToPairs = allSquarePairings;
  fromToPairs.forEach(function(pair){
    let move = isvalidMovement(pair, color, board);
    if (move){ result.push(move); }
  });
  return result;
}

/**
* filter out all but valid normal moves, disregarding special moves and
* check status
* @param {Array} fromToPairs Array of arrays with from, to pairings
* @param {String} activeColor color to move
* @param {Array} board array of arrays representing the board
*/
function isvalidMovement(fromToPairs, activeColor, board){
  let from = fromToPairs[0], to = fromToPairs[1];
  if (from === to){ return false;} // didn't go anywhere
  let fromPiece = getPieceOnSquare(from, board);
  let toPiece = getPieceOnSquare(to, board);
  if (fromPiece === "00"){return false;} //need to move something
  if (fromPiece[0] !== activeColor){ return false;} // is it your turn?
  if ( (toPiece !== "00") && (toPiece[0] === fromPiece[0]) ){  //no friendly fire
    return false;
  }

  switch(fromPiece[1]){
    case "p": return isValidPawnMove(  from, fromPiece, to, toPiece, activeColor, board);
    case "r": return isValidRookMove(  from, fromPiece, to, toPiece, activeColor, board);
    case "n": return isValidKnightMove(from, fromPiece, to, toPiece, activeColor, board);
    case "b": return isValidBishopMove(from, fromPiece, to, toPiece, activeColor, board);
    case "q": return isValidQueenMove( from, fromPiece, to, toPiece, activeColor, board);
    case "k": return isValidKingMove(  from, fromPiece, to, toPiece, activeColor, board);
  }
  return false;
}

/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidPawnMove( from, fromPiece, to, toPiece, activeColor, board){
  let direction = activeColor === "w" ? "n" : "s";

  let result = false;
  // advance one square
  if(to === getSquare(from, direction)){
    if (toPiece !== "00"){ return false;} else {
      result = new Move(from, to, to, fromPiece, toPiece, null);//
    }
  }
  // advance two squares
  if(to === getSquare(from, [direction,direction])){
    let squareInBetween = getSquare(from, direction);
    let pieceInBetween = getPieceOnSquare(squareInBetween, board);
    if ( (from[1] !== "2" && from[1] !== "7") || pieceInBetween !== "00" || toPiece !== "00"){
      return false;
    } else {
      result = new Move(from, to, to, fromPiece, toPiece, null);
    }
  }
  //diagonal capture
  let diagDirections = ["w","e"];
  for (let i=0;i < diagDirections.length; i++){
  //capture west or east
    let diagDirection = diagDirections[i];
    if(to === getSquare(from, direction + diagDirection)){
      if(toPiece !== "00"){
        result =  new Move(from, to, to, fromPiece, getPieceOnSquare(to, board), null);
      }
      if(lastMove.pieceMoved[1] === "p" &&
         lastMove.toSquare === getSquare(from, diagDirection) &&
         lastMove.fromSquare === getSquare(from,[diagDirection,direction,direction])){
           let captureSquare = getSquare(from, diagDirection);
           result = new Move(from, to, captureSquare, fromPiece, getPieceOnSquare(captureSquare,board), null);
      }
    }
  }
  // no valid moves so false
  if (result){
    if (to[1] === "8" || to[1] === "1"){
      result.special = {description: "promotion",promoteTo: activeColor + "q"};
    }
  }
  return result;
}
/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidRookMove(from, fromPiece, to, toPiece, activeColor,board){
    let directions = ["n","s","e","w"];
    for (let i=0; i < directions.length; i++){
      let direction = directions[i];
      if (clearPath(from, to, direction, board) === true){
        return new Move(from, to, to, fromPiece, toPiece, null);
      }
    }
    return false;
}

/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidKnightMove(from, fromPiece, to, toPiece, activeColor, board){
    let directions = [
      ["n","n","w"],
      ["n","n","e"],
      ["s","s","w"],
      ["s","s","e"],
      ["w","w","n"],
      ["w","w","s"],
      ["e","e","n"],
      ["e","e","s"]
    ];
    for (let i=0; i < directions.length;i++){
      let newLocation = from;
      newLocation = getSquare(newLocation, directions[i]);
      if (newLocation === to){
        return new Move(from, to, to, fromPiece, toPiece, null);
      }
    }
    return false;
}

/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidBishopMove(from, fromPiece, to, toPiece, activeColor,board){
  let directions = ["nw","sw","ne","se"];
  for (let i=0; i < directions.length; i++){
    let direction = directions[i];
    if (clearPath(from, to, direction, board) === true){
      return new Move(from, to, to, fromPiece, toPiece, null);
    }
  }
  return false;
}

/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidQueenMove(from, fromPiece, to, toPiece, activeColor, board){
  if (isValidRookMove(from, fromPiece, to, toPiece, activeColor, board) ||
      isValidBishopMove(from, fromPiece, to, toPiece, activeColor, board)){
    return new Move(from, to, to, fromPiece, toPiece, null);
  }
  return false;
}

/**
* update the model
* @param {String} from from square in chess notation
* @param {String} toPiece piece to be moved
* @param {String} to to square in chess notation
* @param {String} toPiece piece on to square
* @param {String} activeColor w or b
* @param {Array} board array of arrays representing board
* @return {Boolean} true if movement of piece is valid
*/
function isValidKingMove(from, fromPiece, to, toPiece, activeColor,board){
  let directions = ["n","ne","e","se","s","sw","w","nw"];
  for (let i=0; i < directions.length; i++){
    let target = getSquare(from, directions[i]);
    if (target === to){
      return new Move(from, to, to, fromPiece, toPiece, null);
    }
  }
  // are you trying to castle perhaps?
  if (to === getSquare(from, ["e","e"]) &&
      getPieceOnSquare(to, board) === "00" &&
      getPieceOnSquare(getSquare(from,"e"), board) == "00" &&
      canCastle[activeColor]["kingside"]){
    return new Move(from, to, null, fromPiece, toPiece, {description: "castle", color: activeColor, direction: "kingside",});
  }
  if (to === getSquare(from, ["w","w"]) &&
    getPieceOnSquare(to, board) === "00" &&
    getPieceOnSquare(getSquare(from,"w"), board) == "00" &&
    canCastle[activeColor]["queenside"]){
    return new Move(from, to, null, fromPiece, toPiece, {description: "castle", color: activeColor, direction: "queenside"});
  }
  return false;
}

/**
* takes chess notation and returns piece on that square
* @param {String} square chess notatino for a square
* @param {Array} board
* @return {String} representation of piece
*/
function getPieceOnSquare(square, board){
  return board[square];
}



/**
* find location of a particular king
* @oaram {String} color "w" or "b"
* @param {Array} board array of arrays representing board
* @return {String} location this king on board as chessNotation
*/
function findKing(color, board){
  let target = color + "k";
  for (let sqr in board){
    if (board[sqr] === target) {
      return sqr;
    }
  }
}

/**
* convert from row, col indices to chess notation
* @param {Array} location from, to pair to be converted
* @return {String} converted chessNotation
*/
function translateIndicesToChessNotation(location){
  let row = String(8 - location[0]);
  let col = "abcdefgh"[location[1]];
  return col + row;
}

/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @return {String} location on board north of argument in chess notation
*/
function north(square){
  let col = square[0], row = square[1];
  let newRow = String(Number(row) + 1);
  return col + newRow;
}

/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @return {String} location on board south of argument in chess notation
*/
function south(square){
  let col = square[0], row = square[1];
  let newRow = String(Number(row) -1);
  return col + newRow;
}

/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @return {String} location on board east of argument in chess notation
*/
function east(square){
  let col = square[0], row = square[1];
  let columns = "xabcdefghx";
  let newCol = columns.charAt(columns.indexOf(col)+1);
  return newCol + row;
}

/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @return {String} location on board west of argument in chess notation
*/
function west(square){
  let col = square[0], row = square[1];
  let columns = "xabcdefghx";
  let newCol = columns.charAt(columns.indexOf(col)-1);
  return newCol + row;
}

/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @param {direction} direction w, s, e, or w
* @return {String} location on board direction of argument in chess notation,
* or null if move is off of the board
*/
function getAdjacentSquare(square, direction){  // example a1, ne
let newSquare;
  switch(direction){
      case "n" :  newSquare = north(square);
                  break;
      case "ne":  newSquare = east(north(square));
                  break;
      case "e" :  newSquare = east(square);
                  break;
      case "se":  newSquare = east(south(square));
                  break;
      case "s" :  newSquare = south(square);
                  break;
      case "sw":  newSquare = west(south(square));
                  break;
      case "w" :  newSquare = west(square);
                  break;
      case "nw":  newSquare = west(north(square));
                  break;
  }
  if (newSquare[0] !== "x" &&
      Number(newSquare[1]) < 9 &&
      Number(newSquare[1]) > 0){
      return newSquare;
    } else {
      return null;
    }
}
/**
*  pulls from mapping set during initialization
* @param {String} square location on board in chess notation
* @param {array} directions array of directions
* @return {String} location on board after moving as indicate by directions
*/
function getSquare(square, directions){
  let currentSquare = square;
  for(let i=0;i < directions.length;i++){
    currentSquare = adjacentSquares[currentSquare][directions[i]];
    if (currentSquare === null){ return null;}
  }
  return currentSquare;
}
/**
*  convert column index into chess notation
* @param {String} square location on board in chess notation
* @param {array} directions array of directions
* @return {String} location on board after moving as indicate by directions
*/
function getNonAdjacentSquare(square, directions){// example - f3, ["n","w"]
  let currentSquare = square;
  for(let i=0;i < directions.length;i++){
    currentSquare = getAdjacentSquare(currentSquare, directions[i]);
    if (currentSquare === null){ return null;}
  }
  return currentSquare;
}

/**
*  convert column index into chess notation
* @param {String} location starting location in chess notation
* @param {String} target target square in chess notation
* @param {String} direction w, s, e, or w
* @param {Array} board array of arrays representing the board
* @return {Boolean} true if no
*/
function clearPath(location, target, direction, board){
  // return true if moving direction leads to target without pieces in between
  while (true) {
    location = getSquare(location, direction);
    if (location === target){ return true;}
    if (location === null || getPieceOnSquare(location, board) !== "00") {
      return false;
    }
  }
}

export const chessControl = { // *****Public Methods*****
    start,
    getBoardAsString,
    requestMove,
    otherColor,
    viewRequest,
    makeLive,
    startLiveGame
  };