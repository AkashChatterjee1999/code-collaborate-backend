const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');
let data = "", clientID, peers = new Map();
let aboutMe = {
    "hello": "hi",
    "clientId": "1233",
    "sessionId": "124qf23f",
    "clientName": "hello12",
    "password": "124457",
    "msg": ""
}

ws.on('open', () => {
    console.log("connected");
});

ws.on('close', function close() {
    console.log('disconnected');
});

process.stdin.on('data', chunk => {
    ws.send(JSON.stringify({ responseEvent: "CHAT", clientID, data: chunk.toString() }));
})

ws.on('message', data => {
    try {
        data = JSON.parse(data);
    } catch(err){
        console.log(data);
    }
    let event = data.responseEvent;
    if(event === "OPEN") {
        clientID = data.metadataData.id;
        data.metadataData.connectedClients.forEach(client => {
            peers.set(client.clientId, { name: client.name, profilePic: client.profilePic });
        })
        ws.send(JSON.stringify({ responseEvent: "CLIENT_INFO", clientName: "Souronil Chatterjee", clientID, profilePic: "holaloafnveijswbvew"  }));
        console.log("Acknowledgement from server: ", data.metadataData);
    } else if(event === "CLIENT_DISCONNECTED") {
        let clientID = data.data.clientID
        console.log(peers.get(clientID)['name'], "has disconnected from the collaborate");
        peers.delete(clientID);
    } else if(event === "CLIENT_CONNECTED") {
        let clientID = data.data.clientID
        peers.set(clientID, { name: data.data.clientName, profilePic: data.data.profilePic })
        console.log(data.data.clientName, "has connected from the collaborate");
    } else {
        console.log(peers.get(data.clientID)?`Message from ${peers.get(data.clientID)['name']}`:"Message from Server: ", data.data);
    }
});









