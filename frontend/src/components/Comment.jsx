import React, { useEffect, useRef, useState } from 'react'
import host from '../host';

function Comment(props) {
    const [output, setOutput] = useState([]);
    const [comment, setComment] = useState('');

    const textRef = useRef(null);


    useEffect(()=>{
        if(props.postComments?.length)setOutput([...props.postComments.filter(x=>x.blogId===props.id)]); 

    },[props.postComments]);

    function uuidV4() {
        const uuid = new Array(36);
        for (let i = 0; i < 36; i++) {
          uuid[i] = Math.floor(Math.random() * 16);
        }
        uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
        uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
        uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        return uuid.map((x) => x.toString(16)).join('');
      }

    function postComment(e) {
        e.preventDefault();
        //Manage state:
        
        e.target.reportValidity();
        if(e.target.checkValidity()) {
            const postBody = {
                comment: comment,
                author: props.user.username,
                blogId: props.id,
                timestamp: new Date(),
                _id: uuidV4(),
            }
            setComment('');
            props.addComment(postBody);
            // Manage DB:
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
                console.log('got res from delete');
                const temp=[postBody,...output];
                setOutput(temp);
            })
            .catch(err=> {
                console.error('error posting blog post: ', err);
            });
        }        

        
    }

    function deleteComment(e) {
        //Manage state:
        const thisid = e.currentTarget.getAttribute('data-id');
        const tempComments = props.postComments.filter(x=>x._id!==thisid);
        // e.currentTarget.parentElement.remove();
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
                <div className="commentHeader">
                    <div className='aauthor'>{o.author}</div>
                    <div className='atimestamp'> {o.timestamp? new Date(o.timestamp).toLocaleDateString() : Date().toLocaleDateString}</div>
                    {props.user?.admin ? <div className='adelete editItem' onClick={deleteComment} data-id={o._id ? o._id : new Date()} ><svg  xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg></div> : null}
                </div>
                
                <div className='acomment'>{o.comment}</div>
            </div>
        );
    }
    if(!props.displayComments)return null;
    return (
        <div className='commentWrapper'>
            {props.user ? <div className="commentInput">
                <form className='formWrapper' onSubmit={e=> postComment(e)}>
                    <textarea ref={textRef} onChange={e=>setComment(e.target.value)} name="comment"  cols="30" rows="3" value={comment} required ></textarea>
                    <button className='btnComment' type='submit' >Comment</button>
                </form>
            </div> : <div>You need to be logged in to comment.</div> }
            <div className="commentBody">
                {/* {output ? output.map((x, i)=>makeComment(x,i)) : null} */}
                {props.postComments ? props.postComments.map((x, i)=>makeComment(x,i)) : null}
            </div>
        </div>
    )
}

export default Comment