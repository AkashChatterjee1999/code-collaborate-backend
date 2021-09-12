const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

app.get('/', (req, res) => {
    res.status(200);
    res.send('Health Check Successful');
});

const server = require('http').createServer(app);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    allow_discovery: true,
});

app.use('/peerServer', peerServer);

server.listen(process.env.PORT, () => console.log(`Express Peer Server started at ${process.env.PORT}`));