import React from 'react'
import Square from './Square'


export default class Row extends React.Component {
    render() {
        return (
            <div className="row">
                <Square rank={this.props.rank} file={'a'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'b'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'c'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'d'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'e'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'f'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'g'} boardObject={this.props.boardObject}/>
                <Square rank={this.props.rank} file={'h'} boardObject={this.props.boardObject}/>
            </div>
        )
    }
}