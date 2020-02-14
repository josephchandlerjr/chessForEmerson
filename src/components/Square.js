import React from 'react'


export default class Square extends React.Component {
    render() {
        let rep = this.props.boardObject[this.props.file + this.props.rank]
        return (
            <div id={this.props.file + this.props.rank} className={this.props.boardObject.flipped ? 'square flipped-board' : 'square'}>
                {rep === "00" ? <img style={ {display: 'none'} } src=""/> : <img src={`./images/${rep}.svg`} /> }
            </div>
        )
    }
}