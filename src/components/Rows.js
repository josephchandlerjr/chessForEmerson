import React from 'react'
import Row from './Row'

const Rows = (props) => {
        return (
            <div>
                {[8,7,6,5,4,3,2,1].map( (rank) => <Row key={rank} rank={rank} />)}
            </div>      
        )
}

export default Rows