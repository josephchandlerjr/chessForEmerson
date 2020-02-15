import React from 'react'

export default class Nav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-info">
                <a className="navbar-brand" href="#"><i className="fas fa-chess-queen"></i> Emerson's Chess App</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" target="_blank" href="/vs">Play Live!</a>
                        </li>
                        <li className="nav-item dropdown"> 
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Computer Plays
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a onClick={this.props.setAutomatedColor} className="dropdown-item" href="#" name="black">Black</a>
                            <a onClick={this.props.setAutomatedColor} className="dropdown-item" href="#" name="white">White</a>
                            <div className="dropdown-divider"></div>
                            <a onClick={this.props.setAutomatedColor} className="dropdown-item" href="#" name="none">None</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a onClick={this.props.reset}className="nav-link" id="reset" href="#">Reset</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={this.props.handleFlipBoard} className="nav-link" id="flip" href="#">Flip Board</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

