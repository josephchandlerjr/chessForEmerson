import React from 'react'
import Row from './Row'

export default class Rows extends React.Component {
    render() {
        return (
            <div>
                {[8,7,6,5,4,3,2,1].map( (rank) => <Row key={rank} rank={rank} gameData={this.props.gameData}/>)}
            </div>
            
        )
        
    }
}