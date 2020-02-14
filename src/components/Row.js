import React from 'react'
import Square from './Square'


export default class Row extends React.Component {
    render() {
        return (
            <div className="row">
                <Square rank={this.props.rank} file={'a'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'b'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'c'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'d'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'e'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'f'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'g'} gameData={this.props.gameData}/>
                <Square rank={this.props.rank} file={'h'} gameData={this.props.gameData}/>
            </div>
        )
    }
}