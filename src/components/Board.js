import React from 'react'
import Rows from './Rows'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        this.lastClicked = null
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.state = {
            grabbed: false,
            selected: undefined,
            target: []
        }
    }
    handleMouseDown(evt) {
        evt.preventDefault()
        const target = evt.target
        if(target.tagName !== 'IMG') return
        const parent = target.parentElement
        const id = parent.id
        const destinations = parent.getAttribute('destinations').split(" ")
        this.lastClicked = id

        this.setState( () => (
            {
                grabbed: true,
                selected: id,
                target: destinations
            }
            ) 
        )
    }
    classNames() {
        let result = ''
        if(this.props.gameData.flipped) result = result + ' ' + 'flipped-board'
        if(this.state.grabbed) result = result + ' ' + 'grabbed'
        return result
    }

    // handleMouseDown(id, destinations){
    //     this.lastClicked = id
    //     destinations = destinations.split(" ")
    //     this.setState( () => (
    //         {
    //             grabbed: true,
    //             selected: id,
    //             target: destinations
    //         }
    //         ) 
    //     )
    //   }
    handleMouseUp(id){
        this.setState( () => (
            {
                grabbed: false,
                selected: undefined,
                target: []
            }
            ) 
        )
        if (this.lastClicked !== null){
            this.props.gameData.makeMove(this.lastClicked, id)
            this.lastClicked = null;
        }
    }
    handleMouseLeave(evt){
        this.lastClicked = null;
        this.setState( () => (
            {
                grabbed: false,
                selected: undefined,
                target: []
            }
            ) 
        )
      }
    render() {
        return (
                <div id="board" className={this.classNames()} 
                     onMouseLeave={this.handleMouseLeave}
                     onMouseDown={this.handleMouseDown}
                     >
                    <Rows 
                        gameData={Object.assign(this.props.gameData, 
                                                { handleMouseDown: this.handleMouseDown, handleMouseUp: this.handleMouseUp },
                                                {selected: this.state.selected, target:this.state.target}) }
                        
                        />
                </div>

        )
    }
}