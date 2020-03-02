import React from 'react'
import { connect } from 'react-redux'
import { destinations } from '../selectors/gameData'

class Square extends React.Component {
    classNames(id) {
        let result = 'square'
        if(this.props.flipped) result = result + ' ' + 'flipped-board'
        if(this.props.selected === id) result = result + ' ' + 'selected'
        if(this.props.target.includes(id)) result = result + ' ' + 'target'
        return result
    }
    render() {
        let id = this.props.file + this.props.rank
        let rep = this.props.board[id]
        return (
            <div id={id} 
                 className={this.classNames(id)}
                //  destinations={this.props.movesMap[id]}
                destinations={destinations(this.props.gameData, id)}
                 >
                {rep === "00" ? <img style={ {display: 'none'} } src=""/> : <img src={`./images/${rep}.svg`} /> }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gameData: state.gameData,
        board: state.gameData.board,
        movesMap: state.gameData.movesMap,
        selected: state.gameData.selected,
        target: state.gameData.target,
        flipped: state.gameData.flipped
    }
}

export default connect(mapStateToProps)(Square)