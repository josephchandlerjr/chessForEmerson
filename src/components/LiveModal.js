import React from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#app') // removes console error

export default class LiveModal extends React.Component {
    constructor(props) {
        super(props)
        this.updateStatus = this.updateStatus.bind(this)
    }
    generateMessage() {
        let status = this.props.liveGameInfo.status
        if(status === 'waiting') return 'Waiting for opponent to arrive...'
        if(status === 'found') return `Your opponent has arrived. You will be playing as ${this.props.liveGameInfo.myColor}.`
        if(status === 'disconnect') return 'Your opponent has disconnected. Click OK to find a new opponent.'
        if(status === 'game-over') return 'Game Over. Click OK to find a new opponent.'
    }
    updateStatus() {
        let status = this.props.liveGameInfo.status

        if(status === 'found') return this.props.updateStatus('playing')
        window.location.reload()
    }
    render(){
        return (
            <Modal
                isOpen={['waiting', 'found', 'disconnect', 'game-over'].includes(this.props.liveGameInfo.status)}
                contentLabel="Live game modal"
                closeTimeoutMS={500}
                className="live-modal"
                >
                <h3 className="live-modal__text">{this.generateMessage()}</h3>
                {
                    this.props.liveGameInfo.status !== 'waiting' &&
                    <button onClick={this.updateStatus}>OK</button>
                }
            </Modal>
        )
        
    }

}
