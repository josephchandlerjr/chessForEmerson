import React from 'react'
import Rows from './Rows'
import { connect } from 'react-redux'

import { setGrabbed } from '../actions/gameData'
import { setTarget } from '../actions/gameData'
import { setSelected } from '../actions/gameData'

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.lastClicked = null
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.state = { grabbed: false }
    }
    handleMouseDown(evt) {
        evt.preventDefault()
        const target = evt.target
        if(target.tagName !== 'IMG') return
        const parent = target.parentElement
        const id = parent.id
        console.log(id)
        const destinations = parent.getAttribute('destinations').split(" ")
        this.lastClicked = id

        this.props.dispatch(setGrabbed(true))
        this.props.dispatch(setTarget(destinations))
        this.props.dispatch(setSelected(id))
        this.setState( () => ({ grabbed: true }))
    }
    classNames() {
        let result = ''
        if(this.props.gameData.flipped) result = result + ' ' + 'flipped-board'
        if(this.state.grabbed) result = result + ' ' + 'grabbed'
        return result
    }
    handleMouseUp(evt){
        evt.preventDefault()
        const id = evt.target.tagName === 'IMG' ? evt.target.parentElement.id : evt.target.id
        this.props.dispatch(setGrabbed(false))
        this.props.dispatch(setTarget([]))
        this.props.dispatch(setSelected(undefined))
        this.setState( () => ({ grabbed: false }))
        if (this.lastClicked !== null){
            this.props.gameData.makeMove(this.lastClicked, id)
            this.lastClicked = null;
        }
    }
    handleMouseLeave(evt){
        this.lastClicked = null;
        this.props.dispatch(setGrabbed(false))
        this.props.dispatch(setTarget([]))
        this.props.dispatch(setSelected(undefined))
        this.setState( () => ({grabbed: false}))
    }
    render() {
        return (
                <div id="board" className={this.classNames()} 
                     onMouseLeave={this.handleMouseLeave}
                     onMouseDown={this.handleMouseDown}
                     onMouseUp={this.handleMouseUp}
                     >
                    <Rows 
                        gameData={Object.assign(this.props.gameData, 
                                                {selected: this.state.selected, target:this.state.target}) }
                        
                        />
                </div>

        )
    }
}

export default connect()(Board)