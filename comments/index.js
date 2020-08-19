const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const { randomBytes} = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commmentId, content});
    commentsByPostId[req.params.id] = comments;
[req]
    res.status(201).send(comments);
});

app.listen(4001, ()=>{
    console.log(chalk.blue("comments listening on 4001..."));
});