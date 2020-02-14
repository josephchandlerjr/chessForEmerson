import React from 'react'
import Row from './Row'

export default class Rows extends React.Component {
    render() {
        return (
            <div>
                <Row rank={8} boardObject={this.props.boardObject}/>
                <Row rank={7} boardObject={this.props.boardObject}/>
                <Row rank={6} boardObject={this.props.boardObject}/>
                <Row rank={5} boardObject={this.props.boardObject}/>
                <Row rank={4} boardObject={this.props.boardObject}/>
                <Row rank={3} boardObject={this.props.boardObject}/>
                <Row rank={2} boardObject={this.props.boardObject}/>
                <Row rank={1} boardObject={this.props.boardObject}/>
            </div>
            
        )
        
    }
}