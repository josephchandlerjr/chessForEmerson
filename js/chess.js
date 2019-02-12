
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
    var fragment = document.createDocumentFragment();
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
      fragment.appendChild(div);
      color = control.otherColor(color);
      if (i % 8 === 0){
        color = control.otherColor(color);
      }
    }
    board.append(fragment);
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
  * toggles between "w" and "b" or "black" and "white"
  @param {string} color
  @return {string} toggled color
  */
  function otherColor(color){
    var result;
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
    var piece = move.pieceMoved;
    var square = move.fromSquare;
    if (piece === "wk"){
      canCastle.w.queenside = false;
      canCastle.w.kingside = false;
    }
    if (piece === "bk"){
      canCastle.b.queenside = false;
      canCastle.b.kingside = false;
    }
    if (piece[1] === "r"){
      if(square[0] === "a"){
        canCastle[piece[0]]["queenside"] = false;
      }
      if(square[0] === "h"){
        canCastle[piece[0]]["kingside"] = false;
      }
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
  */
  function toggleColorToMove(){
    colorToMove = otherColor(colorToMove);
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
    board = board.slice(); // just in case
    var fromIx = translateChessNotationToIndices(from);
    var fromRow = fromIx[0];
    var fromCol = fromIx[1];

    var toIx = translateChessNotationToIndices(to);
    var toRow = toIx[0];
    var toCol = toIx[1];

    var piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = "00";
    board[toRow][toCol] = piece;
    if (captureSquare !== null && captureSquare !== to){ // really only true for pawns
      var captureSquareIx = translateChessNotationToIndices(captureSquare);
      var captureSquareRow = captureSquareIx[0];
      var captureSquareCol = captureSquareIx[1];
      board[captureSquareRow][captureSquareCol] = "00";
    }
    return board;
  }

  /**
  * return deep copy of the getBoard
  * @param {Array} board array of arrays
  * @return {Array} deep copy of board array
  /*/
  function copyBoard(board){
    var newBoard = [];
    for (var i=0;i < board.length; i++){
      newBoard.push(board[i].slice());
    }
    return newBoard;
  }
  /**
  * find squares that are under threat
  * @param {Array} moves an array of move objects
  */
  function getThreatenedSquares(moves){
    var result = moves.map(function(obj){
      if (obj.captureSquare != null){
        return obj.captureSquare;
      }});
    return result.filter(x => x != null);
  };

  /**
  * determins if move is valid and if so executes moves
  * @param {String} from square moving piece from in in chess notation
  * @param {String} to square moving piece to in in chess notation
  * @return {Boolean} true if move executed else false;
  */
  function requestMove(from, to){
    var execute = false; // indicates if we will actually make this move

    // who's who
    var activeColor = colorToMove;
    var opponentsColor = otherColor(activeColor);

    var currentBoard = getBoardasArray();

    // find squares that are threatened by opponent
    var validMovesForOpponent = getAllValidMoves(opponentsColor, currentBoard);
    var opponentThreatens = getThreatenedSquares(validMovesForOpponent);

    // get a list of valid Move objects for activeColor
    // see if requested move is in that list
    var allValidMovesforActiveColor = getAllValidMoves(activeColor, currentBoard);
    var validMovement = false; //
    var thisMove;
    for (var i=0; i < allValidMovesforActiveColor.length; i++){
      thisMove = allValidMovesforActiveColor[i];
      if(thisMove.fromSquare === from && thisMove.toSquare === to){
        validMovement = true;
        break;
      }
    }

    // if we found requested move in the list of valid move objects
    // make that move on a copy of the board and ensure that mover is
    // not putting self in check
    if (validMovement){
      var newBoard = copyBoard(currentBoard);
      newBoard = movePiece(from, to, thisMove.captureSquare, newBoard);
      var newValidMovesForOpponent = getAllValidMoves(opponentsColor, newBoard);

      if(thisMove.special !== null && thisMove.special.description == "castle"){
        // check if square to left/right is threatened
        var direction = thisMove.special.direction === "queenside" ? "w" : "e";
        if (opponentThreatens.includes(thisMove.fromSquare) ||
            opponentThreatens.includes(getAdjacentSquare(thisMove.fromSquare, direction)) ||
            opponentThreatens.includes(getNonAdjacentSquare(thisMove.fromSquare, [direction,direction]))
          ){
            execute = false;
          } else {
            execute = true;
            var rookLocation =  thisMove.special.direction === "queenside"? "a"+from[1] : "h"+from[1];
            var rookDirection = thisMove.special.direction === "queenside" ? "e" : "w";
            var rookTo = getAdjacentSquare(to,rookDirection);
            newBoard = movePiece(rookLocation, rookTo, null, newBoard);
          }
      } else {
        //var newValidMovesForOpponent = getAllValidMoves(opponentsColor, newBoard);
        console.log("newValidMovesForOpponent");
        console.log(newValidMovesForOpponent);
        var newOpponentThreatens = getThreatenedSquares(newValidMovesForOpponent);
        var activeColorKingLocation = findKing(activeColor, newBoard);
        if (newOpponentThreatens.includes(activeColorKingLocation)){
          execute = false;
        } else {
          execute = true;
        }
      } //end if-else statement
    }  //end if statement

    if (execute){
      updateModel(thisMove, newBoard);
      lastMove = thisMove;
      updateCanCastle(thisMove);
      toggleColorToMove();
      if (thisMove.special !== null && thisMove.special.description == "promotion"){
        //still have references to newBoard
        var toIx = translateChessNotationToIndices(thisMove.toSquare);
        var toRow = toIx[0];
        var toCol = toIx[1];
        newBoard[toRow][toCol] = thisMove.special.promoteTo;
      }

      // let's see if we ajust put opponent in checkmate
      var opponentsKingLocation = findKing(opponentsColor, newBoard)
      var newValidMovesForActiveColor = getAllValidMoves(activeColor, newBoard);
      var activeColorNowThreatens = getThreatenedSquares(newValidMovesForActiveColor);
      console.log("newValidMovesForOpponent");
      console.log(newValidMovesForOpponent);
      var isInCheckMate = evaluateCheckmate(opponentsColor, newValidMovesForOpponent, newBoard);
      if (isInCheckMate){alert(`isInCheckMate=${isInCheckMate}`);}
    }
    return execute;
  }

  function evaluateCheckmate(colortoMove, validMoves, board){
    var opponentsColor = otherColor(colorToMove);
    for (var i=0; i < validMoves.length; i++){
      var testingBoard = copyBoard(board);
      var thisMove = validMoves[i];
      movePiece(thisMove.fromSquare, thisMove.toSquare, thisMove.captureSquare, testingBoard);
      var newValidMovesForOpponent = getAllValidMoves(opponentsColor, testingBoard);
      var newThreatenedSquares = getThreatenedSquares(newValidMovesForOpponent);
      var colorToMoveKingLocation = findKing(colortoMove, testingBoard);
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
  }


  /**
  * gets current state of board as an Array
  * @return {Array} array of arrays representing board
  */
  function getBoardasArray(){
    return model.getBoard();
  }

  /**
  * get all moves that are valid based on movement of piece
  * with no regard for check status
  * @param {String} color color of pieces to move
  * @param {Array} board to evaluate
  * @return {Array} array of move objects
  */
  function getAllValidMoves(color,board){
    // simply returns movements that look proper without thought of check status
    // and don't worry about special moves yet.
    var result = [];
    var fromToPairs = getAllSquarePairings();
    fromToPairs.forEach(function(pair){
      var move = isvalidMovement(pair, color, board);
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
    var from = fromToPairs[0];
    var to = fromToPairs[1];
    if (from === to){ return false;} // didn't go anywhere
    var fromPiece = getPieceOnSquare(from, board);
    var toPiece = getPieceOnSquare(to, board);
    if (fromPiece === "00"){return false;} //need to move something
    if (fromPiece[0] !== activeColor){ return false;} // is it your turn?
    if ( (toPiece !== "00") && (toPiece[0] === fromPiece[0]) ){  //no friendly fire
      return false;
    }
    //switch(fromPiece.getKind()){
    switch(fromPiece[1]){
      case "p": return isValidPawnMove(  from, fromPiece, to, toPiece, activeColor, board);break;
      case "r": return isValidRookMove(  from, fromPiece, to, toPiece, activeColor, board);break;
      case "n": return isValidKnightMove(from, fromPiece, to, toPiece, activeColor, board);break;
      case "b": return isValidBishopMove(from, fromPiece, to, toPiece, activeColor, board);break;
      case "q": return isValidQueenMove( from, fromPiece, to, toPiece, activeColor, board);break;
      case "k": return isValidKingMove(  from, fromPiece, to, toPiece, activeColor, board);break;
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
  function isValidPawnMove( from, fromPiece, to, toPiece, activeColor, board){ // arguments are strings like a2 or h7
    var activeColor = fromPiece[0];
    var direction = activeColor === "w" ? "n" : "s";

    result = false;
    // advance one square
    if(to === getAdjacentSquare(from, direction)){
      if (toPiece !== "00"){ return false;} else {
        result = new Move(from, to, to, fromPiece, toPiece, null);//
      }
    }
    // advance two squares
    if(to === getNonAdjacentSquare(from, [direction,direction])){
      var squareInBetween = getAdjacentSquare(from, direction);
      var pieceInBetween = getPieceOnSquare(squareInBetween, board);
      if ( (from[1] !== "2" && from[1] !== "7") || pieceInBetween !== "00" || toPiece !== "00"){
        return false;
      } else {
        result = new Move(from, to, to, fromPiece, toPiece, null);
      }
    }
    //diagonal capture
    var diagDirections = ["w","e"];
    for (var i=0;i < diagDirections.length; i++){
    //capture west or east
      var diagDirection = diagDirections[i];
      if(to === getAdjacentSquare(from, direction + diagDirection)){
        if(toPiece !== "00"){
          result =  new Move(from, to, to, fromPiece, getPieceOnSquare(to, board), null);
        }
        if(lastMove.pieceMoved[1] === "p" &&
           lastMove.toSquare === getAdjacentSquare(from, diagDirection) &&
           lastMove.fromSquare === getNonAdjacentSquare(from,[diagDirection,direction,direction])){
             var captureSquare = getAdjacentSquare(from, diagDirection);
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
      var directions = ["n","s","e","w"];
      for (var i=0; i < directions.length; i++){
        var direction = directions[i];
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
      var directions = [
        ["n","n","w"],
        ["n","n","e"],
        ["s","s","w"],
        ["s","s","e"],
        ["w","w","n"],
        ["w","w","s"],
        ["e","e","n"],
        ["e","e","s"]
      ];
      for (var i=0; i < directions.length;i++){
        var newLocation = from;
        newLocation = getNonAdjacentSquare(newLocation, directions[i]);
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
    var directions = ["nw","sw","ne","se"];
    for (var i=0; i < directions.length; i++){
      var direction = directions[i];
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
    var directions = ["n","ne","e","se","s","sw","w","nw"];
    for (var i=0; i < directions.length; i++){
      var target = getAdjacentSquare(from, directions[i]);
      if (target === to){
        return new Move(from, to, to, fromPiece, toPiece, null);
      }
    }
    // are you trying to castle perhaps?
    if (to === getNonAdjacentSquare(from, ["e","e"]) && canCastle[activeColor]["kingside"]){
      return new Move(from, to, null, fromPiece, toPiece, {description: "castle", color: activeColor, direction: "kingside",});
    }
    if (to === getNonAdjacentSquare(from, ["w","w"]) && canCastle[activeColor]["queenside"]){
      return new Move(from, to, null, fromPiece, toPiece, {description: "castle", color: activeColor, direction: "queenside"});
    }
  }

  /**
  * takes chess notation and returns piece on that square
  * @param {String} square chess notatino for a square
  * @param {Array} board
  * @return {String} representation of piece
  */
  function getPieceOnSquare(square, board){
    var indices = translateChessNotationToIndices(square);
    return board[indices[0]][indices[1]];
  }

  /**
  * get all possible squares on chess board in chess notation
  * @return {Array} array of strings
  */
  function getAllSquares(){
    var columns = "abcdefgh";
    var rows = "12345678";
    var result = [];
    for (var col=0; col < columns.length;col++){
      for (var row=0; row < rows.length;row++){
        result.push(columns[col]+rows[row]);
      }
    }
    return result;
  }

  /**
  * get all moves possible square pairings
  * @param {Array} board to evaluate
  * @return {Array} array of arrays of all possible square pairings
  */
  function getAllSquarePairings(){
    var squares = getAllSquares();
    var result = [];
    for (var f=0; f < squares.length;f++){
      for (var t=0; t < squares.length;t++){
        result.push([ squares[f],squares[t] ]);
      }
    }
    return result;
  }

  /**
  * filter out moves that appear valid but are not because the move would
  * put the mover in check
  * @param {String} color color of pieces to move
  * @param {Array} board to evaluate
  * @param {Array} validMoves array of from, to pairs that valid movement-wise
  * @return {Array} array of arrays of valid from, to pairs
  */
  function getAllValidActions(color,board, validMoves){
    // this should exclude moves where mover puts own king in checkmate
    // use findKing(color); to get king location;
    // use isThreatened(activeColorKingLocation, currentBoard);
  }

  /**
  * find location of a particular king
  * @oaram {String} color "w" or "b"
  * @param {Array} board array of arrays representing board
  * @return {String} location this king on board as chessNotation
  */
  function findKing(color, board){
    var target = color + "k";
    for (var row=0;row < board.length; row++){
      for (var col=0;col < board.length; col++){
        if (target === board[row][col]){
          return translateIndicesToChessNotation([row,col]);
        }
      }
    }
  }

  /**
  *  convert column index into chess notation
  * @param {Number} col col index
  * @return {String} chess notation of that col
  */
  function chessNotationColToIndex(col){
    return "abcdefgh".indexOf(col);
  }

  /**
  * convert from chess notation to row, col indices
  * @param {String} location location to be converted
  * @return {Array} converted to from values
  */
  function translateChessNotationToIndices(location) { // for example turns a1 to row 7 col 0
    var col = "abcdefgh".indexOf(location[0]);
    var row =  8 - Number(location[1]);
    return [row, col];
  }

  /**
  * convert from row, col indices to chess notation
  * @param {Array} location from, to pair to be converted
  * @return {String} converted chessNotation
  */
  function translateIndicesToChessNotation(location){
    var row = String(8 - location[0]);
    var col = "abcdefgh"[location[1]];
    return col + row;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board north of argument in chess notation
  */
  function north(square){
    var col = square[0];
    var row = square[1];
    newRow = String(Number(row) + 1);
    return col + newRow;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board south of argument in chess notation
  */
  function south(square){
    var col = square[0];
    var row = square[1];
    newRow = String(Number(row) -1);
    return col + newRow;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board east of argument in chess notation
  */
  function east(square){
    var col = square[0];
    var row = square[1];
    var columns = "xabcdefghx";
    newCol = columns[chessNotationColToIndex(col) + 2];
    return newCol + row;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board west of argument in chess notation
  */
  function west(square){
    var col = square[0];
    var row = square[1];
    var columns = "xabcdefghx";
    newCol = columns[chessNotationColToIndex(col)];
    return newCol + row;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @param {direction} direction w, s, e, or w
  * @return {String} location on board direction of argument in chess notation
  */
  function getAdjacentSquare(square, direction){  // example a1, ne
    /*
    returns null if move is off the board
    */
    var col = square[0];
    var row = square[1];

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
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @param {array} directions array of directions
  * @return {String} location on board after moving as indicate by directions
  */
  function getNonAdjacentSquare(square, directions){// example - f3, ["n","w"]
    var currentSquare = square;
    for(var i=0;i < directions.length;i++){
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
      location = getAdjacentSquare(location, direction);
      if (location === target){ return true;}
      if (location === null || getPieceOnSquare(location, board) !== "00") {
        return false;
      }
    }
  }

  return { // *****Public Methods*****
      init : init,
      getBoardAsString: getBoardAsString,
      requestMove: requestMove,
      otherColor: otherColor

    };
}());

  /**
  * IIFE to create the Model object in MVC
  * @return {Object} object with public methods
  */
const chessModel = (function(){
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
  /**
  * returns a copy of the board as an array using slice
  * @return {Array} copy of board as an array
  */
  function getBoard(){
    return board.slice();
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
    console.log(moves);
  }

  function updateBoard(newBoard){
    board = newBoard;
  }

  /**
  * returns string representation of board
  * @return {String} string representing board
  */
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
    getBoard : getBoard,
    init : init,
    logMove : logMove,
    getMoves : getMoves,
    updateBoard : updateBoard,
  };
}());

chessModel.init(chessControl);
chessControl.init(chessModel, chessView);
chessView.init(chessControl);
