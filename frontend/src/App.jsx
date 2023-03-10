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
    const [comments, setComments] = useState([]);
    const [postComments, setPostComments] = useState([]);

    

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
            getComments(token);
        }
    },[token]);

    //-------------------
    function debugComment() {
        console.log('postComments: ', postComments);
    }
    function deleteComment(thisid) {
        // const tempComments = postComments.filter(x=>x._id!==thisid);
        console.log('thisid: ', thisid);
        let tempComments=[...postComments];
        const index = tempComments.findIndex(x=>x._id===thisid);
        // tempComments.splice(index, 1);
        tempComments = tempComments.filter(x=>x._id!==thisid);
        console.log('after deletion: ', tempComments);
        setPostComments([...tempComments]);
        
    }
    function addComment(c) {
        // console.log('before adding: ', postComments);
        const newcomments=[c, ...postComments];
        setPostComments(newcomments);
        console.log('after adding: ', newcomments);
    }
    //--------------------------------

    function handleDeleteComment(id) {        
        const tempC=[...comments].filter(x=>x._id!==id);
        setComments(tempC);
    }
    function handleAddComment(c) {        
        const tempC=[c,...comments];
        setComments(tempC);
    }

    function getBlogs(token) {
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
            })
            .catch(err=>console.error('Error getting blogs: ', err));
        }        
    };

    function getComments(token) {    
        console.log('getting comments');    
        const currentToken = 'Bearer '+token;
        if(token!==undefined) {
            fetch(host+'/comment', {
                headers: {
                    "authorization":currentToken 
                },
            })
            .then(res=>res.json())
            .then(data=> {
                console.log('got comments: ', data);
                setComments(data.reverse());
                setPostComments(data.reverse());
            })
            .catch(err=>console.error('Error getting comments: ', err));
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
        console.log('postComments: ', postComments);
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
            {blogs ? blogs.map((x, i)=> <Blog postComments={postComments} setPostComments={setPostComments} addComment={addComment} deleteComment={deleteComment} handleAddComment={handleAddComment} handleDeleteComment={handleDeleteComment} comments={comments} setComments={setComments} getComments={getComments} token={token} user={user} setOutput={setOutput} publishBlog={publishBlog} key={i} data={x} />): null}
        </main>
        {output}
        
        {/* {blogs ? "blogs found": null} */}
    </div>
    )
}

export default App
