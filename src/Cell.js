import React from 'react';

function Cell({id, isAlive, handleClick}){
    let style={}
    if(isAlive){
        style={backgroundColor: 'black', color: 'white'};
    }
    return (
      <td style={style} onClick={handleClick}></td>
    );
}

export default Cell;
