import React, { useEffect, useRef, useState } from 'react'
import host from '../host';
import ErrorModal from './ErrorModal';

function Signup(props) {
    const refFirstname = useRef(null);
    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const refPasword2 = useRef(null);
    const [output, setOutput] = useState(null);

    function send(e) {
        e.preventDefault();
        console.log('in send');
        const body = {
            "username":refFirstname.current.value,
            "email":refEmail.current.value,
            "password":refPassword.current.value
        };
        fetch(host+'/signup', {

            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body),
        })
        .then(res => res.json())
        .then(data=> {
            if(data.emailTaken)setOutput(<ErrorModal close={closeError} text="Email already in use" />);
            if(data.error)setOutput(<ErrorModal close={closeError} text="Error in form submission" />);  
            else {
                localStorage.setItem("token",data.token);
                props.handletoken(data.token);
                props.close();
            }
        });
    }
    function closeError() {
        setOutput(null);
    }

    return (
        <div className='modalWrapper'>
            <div className="modalInner">
                <div className="closeBtn" onClick={props.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
                <form className='form signupForm'>
                    
                    <div className="formGroup">
                        <label htmlFor="firstname">Username:</label>
                        <input ref={refFirstname} type="text" name="firstname"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">email:</label>
                        <input ref={refEmail} type="email" name="email"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password:</label>
                        <input ref={refPassword} type="password" name="password"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password2">Confirm password:</label>
                        <input ref={refPasword2} type="password" name="password2"/>
                    </div>

                    <button className='btn btnSubmit' onClick={send}>Submit</button>

                </form>
                {output}
            </div>
        </div>
    )
}

export default Signup