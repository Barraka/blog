import React, { useEffect, useState } from 'react'

function ErrorModal(props) {


    return (
        <div className='errorWrapper'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M1 21 12 2l11 19Zm3.45-2h15.1L12 6ZM12 18q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-1-3h2v-5h-2Zm1-2.5Z"/></svg>
            <div className="errorText">
                {props.text}
            </div>
            <button className="btn" onClick={props.close}>OK</button>
        </div>
    )
}

export default ErrorModal