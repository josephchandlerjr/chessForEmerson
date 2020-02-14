import React from 'react'
import Rows from './Rows'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props.gameData)
        this.state = {
            layout: "brbnbbbqbkbbbnbr--bpbpbpbpbpbpbpbp--0000000000000000--0000000000000000--0000000000000000--0000000000000000--wpwpwpwpwpwpwpwp--wrwnwbwqwkwbwnwr"
        }
    }
   
    render() {
        return (
                <div id="board-container" className={this.props.gameData.flipped ? 'flipped-board' : ''} >
                    <Rows 
                        gameData={this.props.gameData}
                        />
                </div>

        )
    }
}