import React from 'react';


// accept a list of comments
export default ({comments}) => {

     const renderedcomments = comments.map(comment => {
        return <li key = {comment.id}>{comment.content}</li>;
    });

    return <ul>
        {renderedcomments}
    </ul>;
}