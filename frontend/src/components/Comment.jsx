import React, { useEffect, useState } from 'react'

function Comment(props) {
    const [output, setOutput] = useState(null);
    const [comment, setComment] = useState('');

    function postComment() {

    }

    return (
        <div className='commentWrapper'>
            <div className="commentInput">
                <textarea onChange={e=>setComment(e.target.value)} name="comment"  cols="30" rows="3" value={comment} ></textarea>
                <button className='btnComment' onClick={postComment} >Comment</button>
            </div>
            <div className="commentBody">
                {output}
            </div>
        </div>
    )
}

export default Comment