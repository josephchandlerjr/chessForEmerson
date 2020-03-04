import React from 'react'
import Rows from './Rows'
import { connect } from 'react-redux'
import { requestMove, makeAutoMove } from '../control/control'
import { setLiveGameStatus } from '../actions/liveGameData'
import { setTarget, 
        setSelected,
        setBoard, 
        setMovesMap, 
        addMove, 
        setGameOver,
        setCheckmate, 
        setWinner, 
        setColorToMove, 
        setCanCastle } from '../actions/gameData'

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
        const destinations = parent.getAttribute('destinations').split(" ")
        this.lastClicked = id
        this.props.dispatch(setTarget(destinations))
        this.props.dispatch(setSelected(id))
        this.setState( () => ({ grabbed: true }))
    }
    classNames() {
        let result = ''
        if(this.props.flipped) result = result + ' ' + 'flipped-board'
        if(this.state.grabbed) result = result + ' ' + 'grabbed'
        return result
    }
    handleMouseUp(evt){
        evt.preventDefault()
        const id = evt.target.tagName === 'IMG' ? evt.target.parentElement.id : evt.target.id
        this.props.dispatch(setTarget([]))
        this.props.dispatch(setSelected(undefined))
        this.setState( () => ({ grabbed: false }))
        if (this.lastClicked !== null){
            this.makeMove(this.lastClicked, id)
            this.lastClicked = null;
        }
    }
    handleMouseLeave(evt){
        this.lastClicked = null;
        this.props.dispatch(setTarget([]))
        this.props.dispatch(setSelected(undefined))
        this.setState( () => ({grabbed: false}))
    }
    makeMove(from, to, piece) {
        if (this.props.gameOver) {
        return false;
        }
        if(this.props.live && this.props.liveColor[0] !== this.props.board[from][0]) {
            return false
        }
        let executed = requestMove(from, to, this.props.gameData);
        if (executed) {
            new Promise( (resolve, reject) => {
                this.updateStoreAfterSuccessfulMove(executed)
                resolve()
            }).then( () => {
                    if (this.props.live) {
                        this.props.socket.emit('mirrorGameData', this.props.gameData) 
                    }
                })
            } else {
                return false
            }
    }
    componentDidUpdate() {
        //make automove if appropriate
        if (!this.props.live && this.props.automated[this.props.colorToMove] && !this.props.gameOver){
            let autoMove = makeAutoMove()
            this.updateStoreAfterSuccessfulMove(autoMove)
        }
        // if this is a live game and game is over
        if (this.props.live && this.props.gameOver) {
            this.props.dispatch(setLiveGameStatus('game-over'))
        }
        
    }
    updateStoreAfterSuccessfulMove({ board, canCastle, checkmate, colorToMove, gameOver, movesMap}){
            this.props.dispatch(setBoard(board))
            this.props.dispatch(setMovesMap(movesMap))
            //this.props.dispatch(addMove())
            this.props.dispatch(setGameOver(gameOver))
            this.props.dispatch(setCheckmate(checkmate))
            //this.props.dispatch(setWinner())
            this.props.dispatch(setCanCastle(canCastle))
            this.props.dispatch(setColorToMove(colorToMove))
    }
    render() {
        return (
                <div id="board" className={this.classNames()} 
                     onMouseLeave={this.handleMouseLeave}
                     onMouseDown={this.handleMouseDown}
                     onMouseUp={this.handleMouseUp}
                     >
                    <Rows />
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        automated: state.gameData.automated,
        board: state.gameData.board,
        colorToMove: state.gameData.colorToMove,
        flipped: state.gameData.flipped,
        gameData: state.gameData,
        gameOver: state.gameData.gameOver,
        live: state.liveGameData.live,
        liveColor: state.liveGameData.color,
        socket: state.liveGameData.socket
    }
}

export default connect(mapStateToProps)(Board)