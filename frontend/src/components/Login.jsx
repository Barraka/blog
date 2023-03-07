import React, { useEffect, useState } from 'react'
import host from '../host'
function Login(props) {

    function signGoogle() {
        console.log('trying to sign in with Google:');
        fetch(host+'/auth/google')
        .then(res => console.log('res: ', res));
    }

    return (
        <div className='modalWrapper'>
            <div className="modalInner">
                <button className='btn' onClick={signGoogle}>Login with Google</button>
                <button className='btn'>Login with email</button>
            </div>
            <div className="backdrop"></div>
        </div>
    )
}

export default Login