import React, { useEffect, useState } from 'react'
import host from '../host'
import Email from './Email';
function Login(props) {
    const [output, setOutput] = useState(null);

    function signGoogle() {
        console.log('trying to sign in with Google:');
        fetch(host+'/auth/google')
        .then(res => console.log('res: ', res))
        .catch(err=> console.error('Error with Google sign-in: ', err));
    }
    
    function signEmail() {
        setOutput(<Email handletoken={props.handletoken} close={props.close} setToken={props.setToken}/>);
    }

    return (
        <div className='modalWrapper'>
            <div className="modalInner">
                <div className="closeBtn" onClick={props.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
                <button className='btn' onClick={signGoogle}>Login with Google</button>
                <button className='btn' onClick={signEmail}>Login with email</button>
                {output}
            </div>
            <div className="backdrop"></div>
            
        </div>
    )
}

export default Login