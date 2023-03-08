import React, { useEffect, useState } from 'react'

function Blog(props) {
    useEffect(()=>{

    },[]);

    return (
        <div className='blogWrapper'>
            <div className="blogInfo">
                <span className="blogAuthor">{props.data.author}</span>
                <span className="blogDate">{new Date(props.data.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="blogTitle">{props.data.title}</div>
            <div className="blogText">{props.data.text}</div>
        </div>
    )
}

export default Blog