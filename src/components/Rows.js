import React from 'react'
import Row from './Row'

export default class Rows extends React.Component {
    render() {
        return (
            <div>
                <Row rank={8} gameData={this.props.gameData}/>
                <Row rank={7} gameData={this.props.gameData}/>
                <Row rank={6} gameData={this.props.gameData}/>
                <Row rank={5} gameData={this.props.gameData}/>
                <Row rank={4} gameData={this.props.gameData}/>
                <Row rank={3} gameData={this.props.gameData}/>
                <Row rank={2} gameData={this.props.gameData}/>
                <Row rank={1} gameData={this.props.gameData}/>
            </div>
            
        )
        
    }
}