import React from 'react'


export default class Square extends React.Component {
    render() {
        let id = this.props.file + this.props.rank
        let rep = this.props.gameData.board[id]
        return (
            <div id={id} 
                 className={this.props.gameData.flipped ? 'square flipped-board' : 'square'}
                 destinations={this.props.gameData.getPossibleMoves(id)}
                 >
                {rep === "00" ? <img style={ {display: 'none'} } src=""/> : <img src={`./images/${rep}.svg`} /> }
            </div>
        )
    }
}