import React, { useEffect, useState } from 'react'
import host from '../host';

function Comment(props) {
    const [output, setOutput] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(()=>{
        if(props.postComments?.length)setOutput([...props.postComments.filter(x=>x.blogId===props.id)]); 

    },[props.postComments]);

    function postComment(e) {
        e.preventDefault();
        //Manage state:
        const postBody = {
            comment: comment,
            author: props.user.username,
            blogId: props.id
        }
        // props.handleAddComment(postBody);
        setComment('');
        props.addComment(postBody);
        // props.setPostComments(postBody, ...props.postComments);

        //Manage DB:
        const currentToken = 'bearer '+props.token;        
        fetch(host+'/comment', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "authorization":currentToken 
            },
            body: JSON.stringify(postBody),
        })
        .then(res => {
            const temp=[postBody,...output];
            setOutput(temp);
        })
        .catch(e=> {
            console.error('error posting blog post: ', e);
        });
    }

    function deleteComment(e) {
        //Manage state:
        const thisid = e.currentTarget.getAttribute('data-id');
        const tempComments = props.postComments.filter(x=>x._id!==thisid);
        e.currentTarget.parentElement.remove();
        props.deleteComment(thisid);
        // props.handleDeleteComment(thisid);        

        //Manage DB:
        const currentToken = 'bearer '+props.token;
        fetch(host+'/comment/'+thisid, {
            method:"DELETE",
            headers: {
                "authorization":currentToken 
            },
        })
        .then(res => {
            
        })
        .catch(e=> {
            console.error('error deleting blog post: ', e);
        });
    }

    function debug() {
        console.log('output: ', output);
    }

    function makeComment(o, i) {
        return (
            <div key={o._id ? o._id : i} className='acommentWrapper'>
                <div className='acomment'>{o.comment}</div>
                <div className='aauthor'>{o.author}</div>
                <div className='atimestamp'> {o.timestamp? new Date(o.timestamp).toLocaleDateString() : Date().toLocaleDateString}</div>
                {props.user.admin ? <div className='adelete' onClick={deleteComment} data-id={o._id ? o._id : new Date()} ><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div> : null}
            </div>
        );
    }
    // if(!props.displayComments)return (<></>);
    return (
        <div className='commentWrapper'>
            <div className="commentInput">
                <textarea onChange={e=>setComment(e.target.value)} name="comment"  cols="30" rows="3" value={comment} ></textarea>
                <button className='btnComment' onClick={postComment} >Comment</button>
                <button className='btnComment' onClick={props.debugComment}>debugComment</button>
            </div>
            <div className="commentBody">
                {output ? output.map((x, i)=>makeComment(x,i)) : null}
            </div>
        </div>
    )
}

export default Comment