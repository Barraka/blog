import React, { useEffect, useRef, useState } from 'react'
import Blogpost from './Blogpost';
import Comment from './Comment';

function Blog(props) {
    const refTitle = useRef(null);
    const refText = useRef(null);
    const [displayComments, setDisplayComments] = useState(false)  
    const [comments, setComments] =useState([]); 
    
    useEffect(()=>{
        const temp = props.postComments.filter(x=>x.blogId===props.data._id);
        setComments(temp);
        console.log('blog id: ', props.data._id);
    },[props.postComments]); //

    useEffect(()=>{
        const temp = props.postComments.filter(x=>x.blogId===props.data._id);
        setComments(temp);
        console.log('blog id: ', props.data._id);
    },[props.blogs]);

    function publish(e) {
        const id = e.currentTarget.getAttribute('data-id');
        props.publishBlog(id);
    }

    function editItem(e) {
        props.setOutput(<Blogpost deleteBlog={props.deleteBlog} id={props.data._id} token={props.token} close={()=>props.setOutput(null)} edit={true} data={props.data} />);
    }

    function toggleComments(e) {
        setDisplayComments(!displayComments);
    }

    return (
        <div className='blogWrapper'>
            <div className="blogInfo">
                <span className="blogInfoItem">{props.data.author}</span>
                <span className="blogInfoItem">{new Date(props.data.timestamp).toLocaleDateString()}</span>
                {props.user ? <span className="blogInfoItem editItem" onClick={editItem} data-id={props.data._id}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>
                </span> : null}
            </div>
            <div ref={refTitle} className="blogTitle">{props.data.title}</div>
            <div ref={refText} className="blogText">{props.data.text}</div>
            <div className="commentToggle" onClick={toggleComments} >
                {comments ? comments.length : ''}
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Zm2-4.825L5.175 16H20V4H4ZM4 4v13.175Z"/></svg>
            </div>

            {displayComments}

            <Comment debugComment={props.debugComment} postComments={comments} displayComments={displayComments} addComment={props.addComment} deleteComment={props.deleteComment}   id={props.data._id} user={props.user} token={props.token} data={props.data}/>

            {props.data.publish ? null : <div className='publishWrapper'><button className='btnPublish' onClick={publish} data-id={props.data._id}>Publish</button></div>}
        </div>
    )
}

export default Blog

