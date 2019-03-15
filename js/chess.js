
  /**
  * IIFE to create the View object in MVC
  * @return {Object} object with public methods
  */
const chessView = (function(){
  let lastClicked = null;
  let control;
  let destinations;
  let destSquare;
  const board = document.querySelector("#board");

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
    let squares = board.querySelectorAll(".square, .rank-label, .file-label");
    board.classList.toggle("flipped-board");
    squares.forEach(function(elem){
      elem.classList.toggle("flipped");
    });
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
      control.viewRequest({request:"automate", color:evt.target.value});
    }
  }

  /**
  * Sets control letiable, appends divs to #board and calls update
  * @param {Object} obj Control object in MVC
  */
  function init(obj){
    control = obj;
    let resetButton = document.querySelector("#reset");
    resetButton.addEventListener("click",reset);
    let radioButtons = document.querySelector("#automation-radio-buttons");
    radioButtons.addEventListener("change", onChangeOfAutomationSelection);
    board.classList.remove("flipped-board"); // if board was flipped, unflip
    board.addEventListener("mouseup",mouseUp,false); // during bubbling phase
    board.addEventListener("mousedown",mouseDown,false);
    board.addEventListener("mouseleave",mouseLeave,false);

    let flipButton = document.querySelector("#flip");
    flipButton.addEventListener("click",flipBoard);

    let trs = board.querySelectorAll("tr");
    let col = 97;
    let row = 8;
    let rank = "";
    trs.forEach(function(tr,ix,list){
      tr.innerHTML = "";
    	if (ix < list.length-1 && ix > 0){
      	let th = document.createElement("th");
        rank = 9-ix;
        th.classList.add("rank-label");
        th.textContent = rank;
        tr.appendChild(th);
        for (let i=0; i<8;i++){
            td = document.createElement("td");
            td.classList.add("square");
            let file = String.fromCharCode(col);
            td.id = file + row;
            td.innerHTML = "<img src=''>";
            tr.appendChild(td);
            if (col === 104){
                col = 97;
                row -= 1;
              } else {
                col += 1;
              }
            }
          } else {
            rank = "";
         		for (let i=0; i<9;i++){
              td = document.createElement("th");
              td.classList.add("file-label");
              td.textContent = " abcdefgh".charAt(i);
              tr.appendChild(td);
          	 }
            }
            th = document.createElement("th");
            th.classList.add("rank-label");
            th.textContent = rank;
            tr.appendChild(th);
    });
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
          case "bp": img.setAttribute("src","img/blackPawn.png"); break;
          case "br": img.setAttribute("src","img/blackRook.png"); break;
          case "bn": img.setAttribute("src","img/blackKnight.png"); break;
          case "bb": img.setAttribute("src","img/blackBishop.png"); break;
          case "bq": img.setAttribute("src","img/blackQueen.png"); break;
          case "bk": img.setAttribute("src","img/blackKing.png"); break;

          case "wp": img.setAttribute("src","img/whitePawn.png"); break;
          case "wr": img.setAttribute("src","img/whiteRook.png"); break;
          case "wn": img.setAttribute("src","img/whiteKnight.png"); break;
          case "wb": img.setAttribute("src","img/whiteBishop.png"); break;
          case "wq": img.setAttribute("src","img/whiteQueen.png"); break;
          case "wk": img.setAttribute("src","img/whiteKing.png"); break;
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
    let status = document.querySelector("#status");
    if (!gameOver){
      status.textContent = colorToMove + " to move.";
    } else if (isCheckmate){
      status.textContent = "Checkmate!";
    } else {
      status.textContent = "Draw!";
    }
  }

  return { // *****Public Methods*****
    update : update,
    init : init
  };
}());

/**
* IIFE to create the Control object in MVC
* @return {Object} object with public methods
*/
const chessControl = (function(){
  let model;
  let view;
  let colorToMove;
  let lastMove;
  let canCastle;
  let whiteInCheck;
  let blackInCheck;
  let self;
  let automated = {"b": true, "w": false};
  let movesMap = {};
  let gameOver;
  let isCheckmate;

  /**
  * initializes state variables
  * @param {Object} mObj Model Object
  * @param {Object} vObj View Object
  */
  function init(mObj, vObj){
    if (!self){ // if this is first time initializing
      self = this;
      model = mObj;
      view = vObj;
    }
    gameOver = false;
    isCheckmate = false;
    lastMove = new Move("00","00","00","00","00","00");
    canCastle = {
      w : {queenside: true, kingside: true},
      b : {queenside: true, kingside: true}
    };
    whiteInCheck = false;
    blackInCheck = false;
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
    let allSquares = getAllSquares();
    for (let i=0; i < allSquares.length; i++){
      movesMap[allSquares[i]] = {};
    }
    let validMoves = getAllValidMoves(getBoardasArray());
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
  function viewRequest(request){
    if (request.request === "status"){
      return {colorToMove: colorToMove,
              gameOver: gameOver,
              isCheckmate: isCheckmate
            };
    }
    if (request.request === "reset"){
      init();
    }
    if (gameOver) {
      return false;
    }
    if (request.request === "move"){
      let from = request.from;
      let to = request.to;
      let executed = requestMove(from, to);
      if (executed) {
        if (automated[colorToMove] && !gameOver){
          makeAutoMove();
        }
      }
    }

    if (request.request === "automate"){
      switch (request.color){
        case "none" : automated.b = false; automated.w = false; break;
        case "white": automated.b = false; automated.w = true; break;
        case "black": automated.b = true; automated.w = false; break;
      }
      if (automated[colorToMove]){
        makeAutoMove();
      }
    }

    if (request.request === "validMoves"){
      return movesMap[request.from];
    }
  }
  /**
  * gets all valid moves for both colors
  * @param board array of arrays
  * @return {Object} object with two properties, white and black containing valid moves for each color
  */
  function getAllValidMoves(board){
    let white = getAllValidMovementsByColor("w", board);
    white = removeMovesThatEndangerKing("w", white, board);
    let black = getAllValidMovementsByColor("b", board);
    black = removeMovesThatEndangerKing("b", black, board);
    return {w:white, b:black};
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
            newThreatenedSquares.includes(getAdjacentSquare(thisMove.fromSquare, direction)) ||
            newThreatenedSquares.includes(getNonAdjacentSquare(thisMove.fromSquare, [direction,direction]))){
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
    let piece = move.pieceMoved;
    let square = move.fromSquare;
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
    let currentBoard = getBoardasArray();
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
    board = board.slice(); // just in case
    let fromIx = translateChessNotationToIndices(from);
    let fromRow = fromIx[0];
    let fromCol = fromIx[1];

    let toIx = translateChessNotationToIndices(to);
    let toRow = toIx[0];
    let toCol = toIx[1];

    let piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = "00";
    board[toRow][toCol] = piece;
    if (captureSquare !== null && captureSquare !== to){ // really only true for pawns
      let captureSquareIx = translateChessNotationToIndices(captureSquare);
      let captureSquareRow = captureSquareIx[0];
      let captureSquareCol = captureSquareIx[1];
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
    let newBoard = [];
    for (let i=0;i < board.length; i++){
      newBoard.push(board[i].slice());
    }
    return newBoard;
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
    for (let row=0; row < board.length; row++){
      for (let col=0; col < board.length; col++){
        let piece = board[row][col];
        if (piece[1] === "p"){
          let square = translateIndicesToChessNotation([row,col]);
          if (piece[0] === "w"){
            result.push(getAdjacentSquare(square, "nw"));
            result.push(getAdjacentSquare(square, "ne"));
          }
          if (piece[0] === "b"){
            result.push(getAdjacentSquare(square, "sw"));
            result.push(getAdjacentSquare(square, "se"));
          }
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

    let currentBoard = getBoardasArray();

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
          console.log(thisMove);
          let rookLocation =  thisMove.special.direction === "queenside"? "a"+from[1] : "h"+from[1];
          let rookDirection = thisMove.special.direction === "queenside" ? "e" : "w";
          let rookTo = getAdjacentSquare(to,rookDirection);
          newBoard = movePiece(rookLocation, rookTo, null, newBoard);
        }
        if (thisMove.special.description == "promotion"){
          let toIx = translateChessNotationToIndices(thisMove.toSquare);
          let toRow = toIx[0];
          let toCol = toIx[1];
          newBoard[toRow][toCol] = thisMove.special.promoteTo;
        }
      }

      updateModel(thisMove, newBoard);
      lastMove = thisMove;
      updateCanCastle(thisMove);

      let newValidMovesForOpponent = getAllValidMovementsByColor(opponentsColor, newBoard);

      // let's see if we ajust put opponent in checkmate or if its stalemate
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
  function getAllValidMovementsByColor(color,board){
    // simply returns movements that look proper without thought of check status
    // and don't worry about special moves yet.
    let result = [];
    let fromToPairs = getAllSquarePairings();
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
    let from = fromToPairs[0];
    let to = fromToPairs[1];
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

    result = false;
    // advance one square
    if(to === getAdjacentSquare(from, direction)){
      if (toPiece !== "00"){ return false;} else {
        result = new Move(from, to, to, fromPiece, toPiece, null);//
      }
    }
    // advance two squares
    if(to === getNonAdjacentSquare(from, [direction,direction])){
      let squareInBetween = getAdjacentSquare(from, direction);
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
      if(to === getAdjacentSquare(from, direction + diagDirection)){
        if(toPiece !== "00"){
          result =  new Move(from, to, to, fromPiece, getPieceOnSquare(to, board), null);
        }
        if(lastMove.pieceMoved[1] === "p" &&
           lastMove.toSquare === getAdjacentSquare(from, diagDirection) &&
           lastMove.fromSquare === getNonAdjacentSquare(from,[diagDirection,direction,direction])){
             let captureSquare = getAdjacentSquare(from, diagDirection);
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
      let target = getAdjacentSquare(from, directions[i]);
      if (target === to){
        return new Move(from, to, to, fromPiece, toPiece, null);
      }
    }
    // are you trying to castle perhaps?
    if (to === getNonAdjacentSquare(from, ["e","e"]) &&
        getPieceOnSquare(to, board) === "00" &&
        getPieceOnSquare(getAdjacentSquare(from,"e"), board) == "00" &&
        canCastle[activeColor]["kingside"]){
      return new Move(from, to, null, fromPiece, toPiece, {description: "castle", color: activeColor, direction: "kingside",});
    }
    if (to === getNonAdjacentSquare(from, ["w","w"]) &&
      getPieceOnSquare(to, board) === "00" &&
      getPieceOnSquare(getAdjacentSquare(from,"w"), board) == "00" &&
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
    let indices = translateChessNotationToIndices(square);
    return board[indices[0]][indices[1]];
  }

  /**
  * get all possible squares on chess board in chess notation
  * @return {Array} array of strings
  */
  function getAllSquares(){
    let columns = "abcdefgh";
    let rows = "12345678";
    let result = [];
    for (let col=0; col < columns.length;col++){
      for (let row=0; row < rows.length;row++){
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
    let squares = getAllSquares();
    let result = [];
    for (let f=0; f < squares.length;f++){
      for (let t=0; t < squares.length;t++){
        result.push([ squares[f],squares[t] ]);
      }
    }
    return result;
  }

  /**
  * find location of a particular king
  * @oaram {String} color "w" or "b"
  * @param {Array} board array of arrays representing board
  * @return {String} location this king on board as chessNotation
  */
  function findKing(color, board){
    let target = color + "k";
    for (let row=0;row < board.length; row++){
      for (let col=0;col < board.length; col++){
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
    let col = "abcdefgh".indexOf(location[0]);
    let row =  8 - Number(location[1]);
    return [row, col];
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
    let col = square[0];
    let row = square[1];
    newRow = String(Number(row) + 1);
    return col + newRow;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board south of argument in chess notation
  */
  function south(square){
    let col = square[0];
    let row = square[1];
    newRow = String(Number(row) -1);
    return col + newRow;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board east of argument in chess notation
  */
  function east(square){
    let col = square[0];
    let row = square[1];
    let columns = "xabcdefghx";
    newCol = columns[chessNotationColToIndex(col) + 2];
    return newCol + row;
  }

  /**
  *  convert column index into chess notation
  * @param {String} square location on board in chess notation
  * @return {String} location on board west of argument in chess notation
  */
  function west(square){
    let col = square[0];
    let row = square[1];
    let columns = "xabcdefghx";
    newCol = columns[chessNotationColToIndex(col)];
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
      otherColor: otherColor,
      viewRequest: viewRequest

    };
}());

  /**
  * IIFE to create the Model object in MVC
  * @return {Object} object with public methods
  */
const chessModel = (function(){
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
    board = [[]];
    moves = [];
    capturedPieces = [];
    states = [];
    states.push(startState);
    for (let i=0;i<startState.length;i+=2){
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
  * update capturedPieces
  * @param {String} piece piece captured
  */
  function updateCapturedPieces(piece){
    if (piece !== "00"){
      capturedPieces.push(piece);
    }
    console.log(capturedPieces);
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
  }

  function updateBoard(newBoard){
    board = newBoard;
  }

  /**
  * returns string representation of board
  * @return {String} string representing board
  */
  function toString(){
    let result = "";
    let piece = 0;
    for (let row=0; row < board.length; row++){
      if (row !== 0){result += "--";}
      for (let col=0; col < board.length; col++){
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
    updateCapturedPieces : updateCapturedPieces
  };
}());

chessControl.init(chessModel, chessView);
