const express=require('express');
const axios=require('axios');
const bodyParser=require('body-parser');
const chalk=require('chalk');

const app = express();
app.use(bodyParser.json());

 app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        // if comment contains word orange, reject it
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        
        // post to event bus
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({});
 });

 app.listen(4003, () => {
    console.log(chalk.blue("moderation svc listening on 4003..."));
});

