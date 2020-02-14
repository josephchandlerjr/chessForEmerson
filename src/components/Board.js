import React from 'react'
import Rows from './Rows'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layout: "brbnbbbqbkbbbnbr--bpbpbpbpbpbpbpbp--0000000000000000--0000000000000000--0000000000000000--0000000000000000--wpwpwpwpwpwpwpwp--wrwnwbwqwkwbwnwr"
        }
    }
   
    render() {
        return (
                <div id="board-container" className={this.props.boardObject.flipped ? 'flipped-board' : ''} >
                    <Rows 
                        boardObject={this.props.boardObject}
                        />
                </div>

        )
    }
}