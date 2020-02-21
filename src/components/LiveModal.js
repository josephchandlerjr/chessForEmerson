import React from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#app') // removes console error
const LiveModal = (props) =>  (
    <Modal
        isOpen={props.waiting}
        contentLabel="Waiting for opponent"
    >
       <h3>Waiting for opponent to arrive...</h3>
    </Modal>
)

export default LiveModal