import React from 'react'
import Nav from './Nav'
import Status from './Status'
import Board from './Board'

export default class Chess extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layout: "brbnbbbqbkbbbnbr--bpbpbpbpbpbpbpbp--0000000000000000--0000000000000000--0000000000000000--0000000000000000--wpwpwpwpwpwpwpwp--wrwnwbwqwkwbwnwr",
            flipped: undefined
        }
        this.handleFlipBoard = this.handleFlipBoard.bind(this)
    }

    handleFlipBoard() {
        let flipped = !this.state.flipped
        this.setState( () => ( { flipped } ) )
    }

    boardStringToObject() {
        let board = {};
        let ix = 0;
        let startState = this.state.layout;
        for (let rank=8; rank > 0; rank--) {
          for (let file=0; file < 8; file++){
            let fileLetter = "abcdefgh".charAt(file);
            let rep = startState.slice(ix,ix+2);
            if (rep === "--") {ix+= 2; rep = startState.slice(ix,ix+2);}
            board[fileLetter + rank] = startState.slice(ix,ix+2);
            ix += 2;
          }
        }

        board.flipped = this.state.flipped
        return board;
  }

    render() {
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard} />
                <Status />
                <Board boardObject={this.boardStringToObject()} />
            </div>
            
        )
    }
}