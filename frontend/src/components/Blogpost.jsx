import React, { useEffect, useRef, useState } from 'react'
import host from '../host';

function Blogpost(props) {
    const [valPublish, setValPublish] = useState(true);

    const refTitle=useRef(null);
    const refText=useRef(null);
    const refPublish=useRef(null);
    const [title, setTitle] = useState(props.title ? props.title : "");
    const [text, setText] = useState(props.text ? props.text : "");

    useEffect(()=>{
        setTitle(props.data.title);
        setText(props.data.text);
    },[props]);


    function pushPost(e) {
        e.preventDefault();
        const currentToken = 'bearer '+props.token;
        const postBody = {
            title: refTitle.current.value,
            text: refText.current.value,
            author: props.user.username,
            email: props.user.email,
            publish: valPublish,
        }
        console.log('currentToken: ', currentToken);
        fetch(host+'/blog', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "authorization":currentToken 
            },
            body: JSON.stringify(postBody),
        })
        .then(res => res.json())
        .then(data => {
            console.log('data after fetch: ', data);
            props.setBlogs(data);
        })
        .catch(e=> {
            console.log('error posting blog post: ', e);
        });
        props.close();
    }

    function submitEdit(e) {
        e.preventDefault();
        const currentToken = 'bearer '+props.token;
        const postBody = {
            title: title,
            text: text,
            author: props.data.author,
            email: props.data.email,
            publish: props.publish,
            _id: props.data._id,
        }
        fetch(host+'/updateBlog', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "authorization":currentToken 
            },
            body: JSON.stringify(postBody),
        })
        .then(res => res.json())
        .then(data => {
            console.log('data after update: ', data);
            // props.setBlogs(data);
        })
        .catch(e=> {
            console.log('error posting blog post: ', e);
        });
        props.close();
    }

    return (
        <div className='modalWrapper'>
            <div className="modalInner">
                <div className="closeBtn" onClick={props.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
                <form className='form blogForm'>
                    {/* <label htmlFor="blogtitle">Title:</label> */}
                    <input onChange={e=>setTitle(e.target.value)} ref={refTitle} type="text" name="blogtitle" placeholder='Blog Title' value={title}/>
                    <textarea onChange={e=>setText(e.target.value)} ref={refText} name="blogtext" cols="30" rows="10" placeholder='Something interesting to share...' value={text}></textarea>
                    {props.edit ? null : <label htmlFor="publish">Publish now?</label>}
                    {props.edit ? null : <input type="checkbox" ref={refPublish} onChange={e=>setValPublish(!valPublish)} name="publish" defaultChecked={valPublish} />}
                    {props.edit ? null : <button className='btn' onClick={pushPost}>Submit</button>}
                    
                </form>
                {props.edit ? <button className='btnPublish' onClick={submitEdit}>Submit</button> : null}
                {props.edit ? <button className='btnDelete'>Delete</button> : null}
            </div>
            <div className="backdrop"></div>
        </div>
    )
}

export default Blogpost