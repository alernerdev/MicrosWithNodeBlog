import React from 'react';


// accept a list of comments
export default ({comments}) => {

     const renderedcomments = comments.map(comment => {
        let content;
        console.log(comment);
        if (comment.status === 'approved') {
            content = comment.content;
        } else if (comment.status === 'pending') {
            content = 'Comment is awaiting moderation';
        } else if (comment.status === 'rejected') {
            content = 'Comment has been rejected';
        }

        return <li key = {comment.id}>{content}</li>;
    });

    return <ul>
        {renderedcomments}
    </ul>;
}