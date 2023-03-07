import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import Login from './components/Login';
import './styles/styles.css'
const host='http://localhost:3000';

function App() {
    const [user, setUser] = useState(undefined);
    const [output, setOutput] = useState(null);
    useEffect(()=>{
        fetch(host+'/login')
        .then(res=>res.json())
        .then(data=> {
            if(data.user) {
                console.log('user found in app: ', data.user);
            }
        });
    },[]);

    function login() {
        setOutput(<Login />);
    }
    function signup() {

    }
    function getInfo() {
        fetch(host+'/blogs')
        .then(res=>res.json())
        .then(res=>console.log('res: ', res));
    }

    return (
    <div className="App">
        <h1>In the blog app</h1>
        {user ? null : <h3>You are not signed in</h3>}
        <div className="identificationButtons">
            {!user ? <button className='btn' onClick={signup}>Sign up</button> : null}
            {!user ? <button className='btn' onClick={login}>Log in</button> : null}
        </div>
        <section>
            <button className='btn' onClick={getInfo}>Fetch</button>
        </section>
        {output}
    </div>
    )
}

export default App
