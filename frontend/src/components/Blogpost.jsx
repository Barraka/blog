import React, { useEffect, useRef, useState } from 'react'
import host from '../host';

function Blogpost(props) {
    const [valPublish, setValPublish] = useState(true);

    const refTitle=useRef(null);
    const refText=useRef(null);
    const refPublish=useRef(null);
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
                "Authorization":currentToken 
            },
            body: JSON.stringify(postBody),
        })
        .then(res => res.json())
        .then(data => {
            console.log('data after fetch: ', data);
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
                    <input ref={refTitle} type="text" name="blogtitle" placeholder='Blog Title'/>
                    <textarea ref={refText} name="blogtext" cols="30" rows="10" placeholder='Something interesting to share...'></textarea>
                    <label htmlFor="publish">Publish now?</label>
                    <input ref={refPublish} onChange={e=>setValPublish(prev=>prev==='on' ? false: true)} type="checkbox" name="publish" checked={valPublish} />
                    <button className='btn' onClick={pushPost}>Submit</button>
                </form>
            </div>
            <div className="backdrop"></div>
        </div>
    )
}

export default Blogpost