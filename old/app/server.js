const ws = require("ws");

const server = ws.Server({ host: "localhost", port: "3000" });

server.on('connection',ws => {

    ws.on('message', data => {

        let { metadata } = data;

        server.clients.forEach( client => {

            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }

        });
    });

});