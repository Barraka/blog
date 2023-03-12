import { useState, useEffect } from 'react'
import Blog from './components/Blog';
import Blogpost from './components/Blogpost';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import './styles/styles.css'
import host from './host'


function App() {
    const [user, setUser] = useState(undefined);
    const [output, setOutput] = useState(null);
    const [token, setToken] = useState(undefined);
    const [blogs, setBlogs] = useState(null);
    const [viewUnpublished, setViewUnpublished] = useState(false);
    const [postComments, setPostComments] = useState([]);

    useEffect(()=>{
        const localToken = localStorage.getItem("token");
        if(localToken)handletoken(localToken);
        getBlogs(token);
        getComments(token);
        
    },[]);

    //-------------------

    function deleteComment(thisid) {
        let tempComments=[...postComments];
        const index = tempComments.findIndex(x=>x._id===thisid);
        tempComments.splice(index, 1);
        setPostComments(tempComments);        
    }
    function addComment(c) {
        const newcomments=[c, ...postComments];
        setPostComments(newcomments);
    }
    function deleteBlog(thisid) {
        let tempBlogs=[...blogs];
        const index = tempBlogs.findIndex(x=>x._id===thisid);
        tempBlogs.splice(index, 1);
        setBlogs(tempBlogs);        
    }
    //--------------------------------

    function getBlogs(token=undefined) {
        const currentToken = 'Bearer '+token;
        //With token
        if(token!==undefined) {
            fetch(host+'/blog', {
                headers: {
                    "authorization":currentToken 
                },
            })
            .then(res=>res.json())
            .then(data=>setBlogs(data.reverse()))
            .catch(err=>console.error('Error getting blogs: ', err));
        } else {
            //Without token
            fetch(host+'/blog')
            .then(res=>res.json())
            .then(data=>setBlogs(data.reverse()))
            .catch(err=>console.error('Error getting blogs: ', err));
        }
    };

    function getComments(token=undefined) {      
        const currentToken = 'Bearer '+token;
        //With token
        if(token!==undefined) {
            fetch(host+'/comment', {
                headers: {
                    "authorization":currentToken 
                },
            })
            .then(res=>res.json())
            .then(data=>setPostComments(data.reverse()))
            .catch(err=>console.error('Error getting comments: ', err));
        } else {
        //Without token
            fetch(host+'/comment')
            .then(res=>res.json())
            .then(data=>setPostComments(data.reverse()))
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
            setUser(data);
            setToken(localToken);
        });
    }
    function logout() {
        localStorage.removeItem("token");
        setUser(undefined);
        setToken(undefined);
    }
    function login() {        
        setOutput(<Login handletoken={handletoken} close={close} setToken={setToken}/>);
    }
    function signup() {
        setOutput(<Signup handletoken={handletoken} close={close} setToken={setToken}/>);
    }

    
    function debug() {
        console.log('user: ', user);
    }
    function close() {
        setOutput(null);
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
        <Navbar toggleViewType={toggleViewType} viewUnpublished={viewUnpublished} user={user} logout={logout} login={login} signup={signup} />        

        <div className="blogButtons">
            {user?.admin ? <button className='btn' onClick={newblog}>New blog post</button>: null}
            
        </div>
        

        <main className='main'>            
            {blogs ? blogs.map((x, i)=> <Blog deleteBlog={deleteBlog} postComments={postComments} addComment={addComment} deleteComment={deleteComment} token={token} user={user} setOutput={setOutput} publishBlog={publishBlog} key={i} data={x} />): null}
        </main>
        {output}
        
        {/* {blogs ? "blogs found": null} */}
    </div>
    )
}

export default App
