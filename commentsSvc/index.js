const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const { randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', async (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content, status: 'pending'});
    commentsByPostId[req.params.id] = comments;

    // post event
    await axios.post('http://localhost:4005/events', {
        type:  'CommentCreated',
        data: {
            id: commentId,
            content,
            status: 'pending',
            postId: req.params.id
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type==='CommentModerated') {
        // find the moderated comment and update it
        const { postId, id, status, content} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }
 
    console.log('received event', req.body.type);
    res.send({});
});

app.listen(4001, ()=>{
    console.log(chalk.blue("comments svc listening on 4001..."));
});