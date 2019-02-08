
  /**
  * IIFE to create the View object in MVC
  * @return {Object} object with public methods
  */
const chessView = (function(){

  //HTML symbols for chess peices
  const blackRook   = "&#9820;";
  const blackKnight = "&#9822;";
  const blackBishop = "&#9821;";
  const blackQueen  = "&#9819;";
  const blackKing   = "&#9818;";
  const blackPawn   = "&#9823;";

  const whitePawn   = "&#9817;";
  const whiteRook   = "&#9814;";
  const whiteKnight = "&#9816;";
  const whiteBishop = "&#9815;";
  const whiteQueen  = "&#9813;";
  const whiteKing   = "&#9812;";

  var lastClicked = null;
  var control;

  /**
  * listener for div elements that make up chess board
  * @param {Event} evt
  */
  function onClick(evt){

    //HTML symbols for chess peices
    var id = evt.target.id;
    if (id === "board"){ return;}  // if is top elem div and not square
    if (lastClicked === null){
      lastClicked = evt.target;
      lastClicked.classList.add("selected");
    } else {
      lastClicked.classList.toggle("selected");
      control.requestMove(lastClicked.id, id);
      update();
      lastClicked = null;
    }
  }

  /**
  * Sets control variable, appends divs to #board and calls update
  * @param {Object} obj Control object in MVC
  */
  function init(obj){

    control = obj;
    var board = document.querySelector("#board");
    board.innerHTML = "";
    board.addEventListener("click",onClick,false); // during bubbling phase
    var color = "white";
    var col = 97;
    var row = 8;

    for (var i=1; i < 65; i++){
      var div = document.createElement("div")
      div.classList.add(color);
      div.id = String.fromCharCode(col) + row;
      if (col === 104){
        col = 97;
        row -= 1;
      } else {
        col += 1;
      }
      board.appendChild(div);
      color = (color === "white") ? "black" : "white";
      if (i % 8 === 0){
        color = (color === "white") ? "black" : "white";}
    }
    update();
  }

  /*
  * Gets board from Control object and sets innerHTML of divs representing squares
  */
  function update(){

    var squares = document.querySelectorAll("#board div");
    var rep = control.getBoardAsString();
    var sqr = 0
    for (var i=0;i<rep.length;i+=2){
      if (rep[i] !== "-"){
        switch(rep.substring(i,i+2)) { // **********
          case "00": squares[sqr].innerHTML = ""; break;
          case "bp": squares[sqr].innerHTML = blackPawn; break;
          case "br": squares[sqr].innerHTML = blackRook; break;
          case "bn": squares[sqr].innerHTML = blackKnight; break;
          case "bb": squares[sqr].innerHTML = blackBishop; break;
          case "bq": squares[sqr].innerHTML = blackQueen; break;
          case "bk": squares[sqr].innerHTML = blackKing; break;

          case "wp": squares[sqr].innerHTML = whitePawn; break;
          case "wr": squares[sqr].innerHTML = whiteRook; break;
          case "wn": squares[sqr].innerHTML = whiteKnight; break;
          case "wb": squares[sqr].innerHTML = whiteBishop; break;
          case "wq": squares[sqr].innerHTML = whiteQueen; break;
          case "wk": squares[sqr].innerHTML = whiteKing; break;
        }
        sqr += 1
      }
    }
  }

  return { // *****Public Methods*****
    update : update,
    init : init
  }
}());
/**
* IIFE to create the Control object in MVC
* @return {Object} object with public methods
*/
const chessControl = (function(){
  var model;
  var view;
  var colorToMove;
  var lastMove;
  var canCastle;
  var whiteInCheck;
  var blackInCheck;

  /**
  * initializes state variables
  * @param {Object} mObj Model Object
  * @param {Object} vObj View Object
  */
  function init(mObj, vObj){
    model = mObj;
    view = vObj;
    colorToMove = "w";
    lastMove = new Move("00","00","00","00","00","00");
    canCastle = {
      w : {queenside: true, kingside: true},
      b : {queenside: true, kingside: true}
    };
    whiteInCheck = false;
    blackInCheck = false;
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
  * retrieves board information from Model
  * @return {String} board state as a string
  */
  function getBoardAsString(){
    return model.toString();
  }

  function requestMove(from, to){
    /*
    what color am
    what color is my opponent
    */
    var activeColor = colorToMove;
    var opponentsColor = activeColor === "w" ? "b" : "w";
    /*
    am I in check, if so am I in checkmate
    */
    var currentBoard = getBoardasArray();
    var validMovesForOpponent = getAllValidActions(opponentsColor, currentBoard);
    var validMovesForActiveColor = getAllValidActions(activeColor);
    var activeColorKingLocation = findPiece(activeColor + "k");
    // set amInCheck

    var activeColorInCheck = isThreatened(activeColorKingLocation, currentBoard);
    if (activeColorInCheck){
      make each move and check if still in check
    }
    /*
    can I move this way
    move
    am I in check if so can't do this, go back
    is my opponent in check, if so tell her she's in check
    */
  }
  function getBoardasArray(){
    return model.getBoard();
  }
  function isThreatened(location, board){}
  function logMove(moveObj, newBoard){}
  function getAllValidMoves(color,board){
    // simply returns movements that look proper without though of check status
    // use findPiece(pieceId); to get king location;
    // use isThreatened(activeColorKingLocation, currentBoard);
  }
  function getAllValidActions(color,board)}{
    // this should exclude moves where mover puts own king in checkmate
    // get copy of board via getBoard, move and then asssess TeufelKreis recursion?
  }
  function findPiece(pieceId){}


  return { // *****Public Methods*****
      init : init,
      getBoardAsString: getBoardAsString,
      requestMove: requestMove

    };
}());
  /**
  * IIFE to create the Model object in MVC
  * @return {Object} object with public methods
  */
  const chessModel = (function(){   //Revealed Module Pattern
  // states holds array of strings representing the pieces on the board
  const startState = "brbnbbbqbkbbbnbr--bpbpbpbpbpbpbpbp--0000000000000000--0000000000000000--0000000000000000--0000000000000000--wpwpwpwpwpwpwpwp--wrwnwbwqwkwbwnwr";
  var states;
  var moves;
  var board;
  var control;

  /**
  * Sets initial state variables
  * @param {Object} obj Control object in MVC
  */
  function init(obj){
    control = obj;
    board = [[]];
    moves = [];
    states = [];
    states.push(startState);
    for (var i=0;i<startState.length;i+=2){
      if (startState[i] === "-"){
        board.push([]);
        } else if (startState[i] === "0"){
        board[board.length - 1].push("00");
        } else {
        board[board.length - 1].push(startState.slice(i,i+2));
        }
    }
  }

  function getBoard(){
    return board.slice();
  }

  function getMoves(){
    return moves;
  }

  function logMove(move){
    moves.push(move);
    console.log(moves);
  }
  function toString(){
    var result = "";
    var piece = 0;
    for (var row=0; row < board.length; row++){
      if (row !== 0){result += "--";}
      for (var col=0; col < board.length; col++){
        piece = board[row][col];
        result += piece;
      }
    }
    return result;
  }
  return {   // *****Public Methods*****
    toString : toString,
    init : init,
    logMove : logMove,
    getMoves: getMoves
  };
}());
chessModel.init(chessControl);
chessControl.init(chessModel, chessView);
chessView.init(chessControl);
