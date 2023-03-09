import { useState, useEffect } from 'react'
import Blog from './components/Blog';
import Blogpost from './components/Blogpost';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/styles.css'
const host='http://localhost:3000';

function App() {
    const [user, setUser] = useState(undefined);
    const [output, setOutput] = useState(null);
    const [token, setToken] = useState(undefined);
    const [blogs, setBlogs] = useState(null);
    const [viewUnpublished, setViewUnpublished] = useState(false);

    useEffect(()=>{
        const localToken = localStorage.getItem("token");
        if(localToken)handletoken(localToken);
        
    },[]);

    useEffect(()=>{
    
    },[user]);

    useEffect(()=>{
        console.log('new token: ', token);
        if(token) {
            handletoken(token);
            getBlogs(token);
        }
    },[token]);

    useEffect(()=>{
        console.log('in use effect blogs: ', blogs);
    },[blogs]);

    function getBlogs(token) {
        console.log('token in getblogs: ', token);
        const currentToken = 'Bearer '+token;
        if(token!==undefined) {
            fetch(host+'/blog', {
                headers: {
                    "authorization":currentToken 
                },
            })
            .then(res=>res.json())
            .then(data=> {
                setBlogs(data);
            });
        }
        
    };

    function handletoken(localToken) {
        const fetchToken='bearer '+localToken;
        fetch(host+'/login', {
            headers: {
                "authorization":fetchToken  
            }
        })
        .then(res=>res.json())
        .then(data=> {
            console.log('data after login: ', data);
            setUser(data);
            setToken(localToken);
        });
    }

    function login() {        
        setOutput(<Login close={close} setToken={setToken}/>);
    }
    function signup() {
        setOutput(<Signup close={close} setToken={setToken}/>);
    }
    function debug() {
        console.log('blogs: ', token);
    }
    function close() {
        setOutput(null);
    }
    function logout() {
        localStorage.removeItem("token");
        setUser(undefined);
        setToken(undefined);
    }
    function newblog() {
        setOutput(<Blogpost token={token} user={user} close={close} setBlogs={setBlogs}/>);
    }
    function toggleViewType() {
        const fetchToken='bearer '+token;
        console.log('viewUnpublished: ', viewUnpublished);
        if(!viewUnpublished) {   
            setViewUnpublished(true);         
            fetch(host+'/unpublished', {
                headers: {
                    "authorization":fetchToken  
                }
            })
            .then(res=>res.json())
            .then(data=> {
                setBlogs(data);                
            });
        } else {
            setViewUnpublished(false);
            fetch(host+'/blog', {
                headers: {
                    "authorization":fetchToken  
                }
            })
            .then(res=>res.json())
            .then(data=> {
                setBlogs(data);
            });
        }
    }
    function publishBlog(id) {
        console.log('id: ', id);
        const fetchToken='bearer '+token;
        fetch(host+'/publish', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization":fetchToken  
            },
            body: JSON.stringify({_id: id}),
        })
        .then(res=>res.json())
        .then(data=> {
            console.log('data after publish: ', data);
            setBlogs(data.published);
        });
    }

    return (
    <div className="App">
        <h1>In the blog app</h1>
        {user ?<h3>You are signed in as {user.username}</h3> : <h3>You are not signed in</h3>}
        {user ? <button className='btn' onClick={logout}>Log out</button> : null}
        <div className="identificationButtons">
            {!user ? <button className='btn' onClick={signup}>Sign up</button> : null}
            {!user ? <button className='btn' onClick={login}>Log in</button> : null}
        </div>

        <button className='btn' onClick={debug}>Debug</button>
        {user?.admin ? <button className='btn' onClick={newblog}>New blog post</button>: null}
        {user?.admin ? <button className='btn' onClick={toggleViewType}>{viewUnpublished ? "View published" : "View unpublished"}</button>: null}

        <main className='main'>            
            {blogs ? blogs.map((x, i)=> <Blog token={token} user={user} setOutput={setOutput} publishBlog={publishBlog} key={i} data={x} />): null}
        </main>
        {output}
        
        {/* {blogs ? "blogs found": null} */}
    </div>
    )
}

export default App
