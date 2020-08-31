const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const app = express();
app.use(bodyParser.json());

/* this is my event store.  Store all the events so that they can be 
replayed in case some svc goes down and misses a bunch
*/
const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    // store in the event store
    events.push(event);

    // posts svc
    axios.post('http://localhost:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    // query svc
    axios.post('http://localhost:4002/events', event);
    // moderator svc
    axios.post('http://localhost:4003/events', event);
    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log(chalk.blue('event bus listening on 4005'));
});
