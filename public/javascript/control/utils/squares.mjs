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
function getAllSquarePairings(allSquares){
  let result = [];
  for (let f=0; f < allSquares.length;f++){
    for (let t=0; t < allSquares.length;t++){
      result.push([allSquares[f],allSquares[t] ]);
    }
  }
  return result;
}

export { getAllSquares, getAllSquarePairings }