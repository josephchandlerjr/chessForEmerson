import React from 'react'
import Square from './Square'


const Row = (props)  => {
        return (
            <div className="row">
            {["a","b","c","d","e","f","g","h"].map( (file) => <Square 
                                                                key={file+props.rank}
                                                                rank={props.rank}
                                                                file={file} 
                                                                />)}
            </div>
        )  
}

export default Row