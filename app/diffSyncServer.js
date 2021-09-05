const http = require('http');
const io = require('socket.io');
const diffSync = require("diffsync");

const httpServer =  http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.write("HTTP/1.1 200 OK\r\n\r\n");
    res.end();
});

httpServer.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

const socket = io(httpServer,{
    cors: {
        origin: "*",
        methods: "*"
    }
});

let dataAdapter = new diffSync.InMemoryDataAdapter();
let diffSyncServer = new diffSync.Server(dataAdapter, socket);

// starting the http server
httpServer.listen(5051, () => console.log(`The DiffSync Server is ready`));

