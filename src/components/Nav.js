import React from 'react'
import { connect } from 'react-redux'
import { toggleFlipped, setAutomated, reset} from '../actions/gameData'
import { setLiveGame, setLiveGameStatus } from '../actions/liveGameData'


class Nav extends React.Component {
    constructor(props){
        super(props)
        this.setAutomated = this.setAutomated.bind(this)
    }
    setAutomated(color) {
        new Promise( (resolve, reject) => {
            this.props.dispatch(setAutomated(color))
            resolve()
        }).then( () => {
            console.log(this.props.automated)
        })
    }
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-info">
                <a id="brand" className="navbar-brand" href="#"><i className="fas fa-chess-queen"></i> Emerson's Chess App</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => {
                                    if (this.props.live) {
                                        this.props.dispatch(setLiveGameStatus('abort'))
                                    } else {
                                        this.props.dispatch(setLiveGame())
                                        this.props.dispatch(reset())
                                    }
                                }
                            }>{this.props.live ? 'Play Computer' : 'Play Live'}</a>
                        </li>
                        {!this.props.live &&
                            <li className="nav-item dropdown"> 
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Computer Plays
                                </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a onClick={() => this.props.dispatch(setAutomated('b'))} className="dropdown-item" href="#" name="black">Black</a>
                                        <a onClick={() => this.props.dispatch(setAutomated('w'))} className="dropdown-item" href="#" name="white">White</a>
                                        <div className="dropdown-divider"></div>
                                        <a onClick={() => this.props.dispatch(setAutomated('none'))} className="dropdown-item" href="#" name="none">None</a>
                                    </div>   
                            </li>
                        }
                        {!this.props.live &&
                            <li className="nav-item">
                                <a onClick={() => this.props.dispatch(reset())}className="nav-link" id="reset" href="#">Reset</a>
                            </li>
                        }
                        <li className="nav-item">
                            <a onClick={() => this.props.dispatch(toggleFlipped())} className="nav-link" id="flip" href="#">Flip Board</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        automated: state.gameData.automated,
        colorToMove: state.gameData.colorToMove,
        gameOver: state.gameData.gameOver,
        live: state.liveGameData.live
    }
}

export default connect(mapStateToProps)(Nav)