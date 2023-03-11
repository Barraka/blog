import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png';

function Navbar(props) {


    return (
        <div className='navbar'>
            {/* {props.user ?<h3>You are signed in as {props.user.username}</h3> : <h3>You are not signed in</h3>} */}
            <div className="logoWrapper">
                <img src={logo} alt="logo" />
            </div>
            <div className="identificationButtons">
                {props.user ? <div className='user'><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.075.788-3.9.787-1.825 2.15-3.175Q6.3 3.575 8.125 2.787 9.95 2 12 2q2.075 0 3.9.787 1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12q0 2.05-.788 3.875-.787 1.825-2.137 3.187-1.35 1.363-3.175 2.15Q14.075 22 12 22Zm0-18Q9.225 4 7.1 5.662 4.975 7.325 4.275 9.9q.5-.125 1.037-.488Q5.85 9.05 6.55 7.65q.375-.775 1.1-1.212Q8.375 6 9.25 6h5.5q.875 0 1.6.438.725.437 1.1 1.212.7 1.425 1.263 1.775.562.35 1.012.475-.7-2.575-2.812-4.238Q14.8 4 12 4Zm0 16q3.35 0 5.688-2.35 2.337-2.35 2.312-5.7-1.775-.175-2.725-1.113-.95-.937-1.625-2.287-.125-.275-.362-.413Q15.05 8 14.775 8H9.25q-.3 0-.537.137-.238.138-.363.413-.675 1.375-1.65 2.312-.975.938-2.7 1.113 0 3.35 2.338 5.688Q8.675 20 12 20Zm-3-5.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM12 6Z"/></svg>{props.user.username}</div> : null}
                {props.user ? <button className='btn' onClick={props.logout}>Log out</button> : null}
                {props.user?.admin ? <button className='btn' onClick={props.toggleViewType}>{props.viewUnpublished ? "View published" : "View unpublished"}</button>: null}
            </div>
            
            <div className="identificationButtons">
                {!props.user ? <button className='btn' onClick={props.signup}>Sign up</button> : null}
                {!props.user ? <button className='btn' onClick={props.login}>Log in</button> : null}
            </div>
        </div>
    )
}

export default Navbar