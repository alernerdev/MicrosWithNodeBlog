const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
 
app.get('/posts', async (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type === 'PostCreated') {
        // here, id is the post id
        const {id, title} = data;
        posts[id] = {id,title, comments:[]};
    } else if (type === 'CommentCreated') {
        // here, id is the comment id
        const {id, content, postId} = data;
        const post = posts[postId];
        post.comments.push({id, content});
    }

    res.send({});
});

app.listen(4002, () => {
    console.log(chalk.blue("query svc listening on 4002"));
});

