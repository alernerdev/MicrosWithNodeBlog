const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        // here, id is the post id
        const {id, title} = data;

        posts[id] = {id,title, comments:[]};
    } else if (type === 'CommentCreated') {
        // here, id is the comment id
        const {id, content, postId, status} = data;

        const post = posts[postId];
        post.comments.push({id, content, status});
    } else if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        // notice that I am updating content as well
        // since I dont know what really changed
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', async (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);
 
    res.send({});
});

app.listen(4002, async () => {
    console.log(chalk.blue("query svc listening on 4002"));

    // ask event bus for whatever I have missed
    const res = await axios.get('http://localhost:4005/events');
    for (let event of res.data) {
        console.log('Processing event:', event.type)
        handleEvent(event.type, event.data);
    }
});

