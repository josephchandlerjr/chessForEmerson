import React from 'react'

export default class Square extends React.Component {
    classNames(id) {
        let result = 'square'
        if(this.props.gameData.flipped) result = result + ' ' + 'flipped-board'
        if(this.props.gameData.selected === id) result = result + ' ' + 'selected'
        if(this.props.gameData.target.includes(id)) result = result + ' ' + 'target'
        return result
    }
    render() {
        let id = this.props.file + this.props.rank
        let rep = this.props.gameData.board[id]
        let destinations = this.props.gameData.getPossibleMoves(id)
        return (
            <div id={id} 
                 className={this.classNames(id)}
                 destinations={destinations}
                //  onMouseDown={(evt) => { 
                //      evt.preventDefault()
                //      this.props.gameData.handleMouseDown(id, destinations)
                //  } }
                 onMouseUp={(evt) => { 
                    evt.preventDefault()
                    this.props.gameData.handleMouseUp(id)
                } }
                 >
                {rep === "00" ? <img style={ {display: 'none'} } src=""/> : <img src={`./images/${rep}.svg`} /> }
            </div>
        )
    }
}