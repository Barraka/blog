import React, { useEffect, useRef, useState } from 'react'
import host from '../host'
import ErrorModal from './ErrorModal';

function Email(props) {
    const emailRef=useRef(null);
    const passwordRef=useRef(null);
    const [output, setOutput] = useState(null);


    function login(e) {
        e.preventDefault();
        console.log('mail: ', emailRef.current.value);
        fetch(host+'/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // username:emailRef.current.value,
                email:emailRef.current.value,
                password: passwordRef.current.value,
            })
        })
        .then(res=>res.json())
        .then(data=> {
            if(data.error)setOutput(<ErrorModal close={props.close} text="An error occured. Please try again"/>);
            else {
                localStorage.setItem("token", data.token);
                props.handletoken(data.token);
                props.close();
            }
        });
    }

    return (
        <div className='emailWrapper'>
            <form className='emailForm'>
                <div className="closeBtn" onClick={props.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input ref={emailRef} type="email" name="email" id="email" />
                </div>

                <div className="inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input ref={passwordRef} type="password" name="password" id="password" />
                </div>

                <button className='btn' type="submit" onClick={login}>Log in</button>
            </form>
            {output}
        </div>
    )
}

export default Email