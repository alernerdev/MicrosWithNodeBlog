import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

// to get a list of comments, need to know ostId
export default ({postId}) => {

    const [comments, setComments] = useState([]);

    const fetchData = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(res.data);
    };

    useEffect(()=>{
        fetchData();
    }, []);

    const renderedcomments = comments.map(comment => {
        return <li key = {comment.id}>{comment.content}</li>;
    });

    return <ul>
        {renderedcomments}
    </ul>;
}