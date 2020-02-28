import React from 'react'
import Square from './Square'


export default class Row extends React.Component {
    render() {
        return (
            <div className="row">
            {["a","b","c","d","e","f","g","h"].map( (file) => <Square 
                                                                   rank={this.props.rank}
                                                                   file={file} 
                                                                   gameData={this.props.gameData}
                                                                   />)}
            </div>
        )
    }
}