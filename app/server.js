const ws = require("ws");
const uuid = require("uuidv4");
const server = new ws.Server({ host: "localhost", port: "3000" });
let clientMap = new Map();
let clientInfo = new Map();

functionalMap = {
    onOpenAcknowledgement: id => {
        let connectedClients = [];
        clientInfo.forEach((client, clientId) => {
            connectedClients.push({
                clientId, name: client.name, profilePic: client.profilePic
            })
        });
        return {"responseEvent": "OPEN", "responseType": "acknowledge", "metadataData": { id, connectedClients }}
    },
    onClientDisconnected: clientID => {
        return {"responseEvent": "CLIENT_DISCONNECTED", "responseType": "info", "data": { clientID }}
    },
    onClientJoined: (clientID, clientName, profilePic) => {
        return {"responseEvent": "CLIENT_CONNECTED", "responseType": "info", "data": { clientID, clientName, profilePic }}
    }
}

initializeClient = ws => {
    let clientId = uuid.uuid();
    clientMap.set(clientId, ws);
    return functionalMap.onOpenAcknowledgement(clientId);
}

broadCastMessage = message => {
    server.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(message);
        }
    });
}

server.on('connection',ws => {

    /**
     * Scenario1: Whenever we see that a new client ahs joined then do foloowing steps
     * 1. add that client to the client map
     * 2. greet the client with their new id
     * 3. tell others about a new client has joined with the new message of clientID
     * 4. Also tell the client about the others who have already joined the collaborate;
     */

    // greeted that client
    let clientData = initializeClient(ws);
    ws.send(JSON.stringify(clientData));

    /*
    * Scenario2: Whenever a new message is received then-
    * step1: check to whom it is specified by looking at the to attribute
    * step2: if to is specified to ALL then broadcast that message
    * step3: if the message is specified then check weather that client exists and
    * */
    ws.on('message', data => {

        try {
            data = JSON.parse(data);
        } catch(err) {
            console.log("Normal message");
        }

        if(data.responseEvent) {
            if(data.responseEvent === 'CLIENT_INFO') {
                let clientName = data.clientName;
                let clientID = data.clientID;
                let profilePic = data.profilePic;
                console.log(clientName, "has joined the collaborate");
                clientInfo.set(clientID, { name: clientName, profilePic });
                broadCastMessage(JSON.stringify(functionalMap.onClientJoined(clientID, clientName, profilePic)));
            } else if(data.responseEvent === 'CHAT') {
                broadCastMessage(JSON.stringify(data));
            }
        } else {
            let { metadata } = data;
            if(!metadata || !metadata.to) {
                broadCastMessage(data);
            } else {
                let client = clientMap.get(metadata.to);
                if(client.readyState === ws.OPEN) {
                    client.send(data);
                }
            }
        }

    });

    /*
    * Scenario3: When the client looses connection and closes the socket
    * Step1: Remove the client from the client map
    * Step2: broadcast that message that this client has left
    * */
    ws.on('close', () => {
        clientMap.forEach((client, clientID) => {
            if(client === ws) {
                clientMap.delete(clientID);
                console.log(clientInfo.get(clientID).name, "has disconnected the collaborate");
                clientInfo.delete(clientID);
                broadCastMessage(JSON.stringify(functionalMap.onClientDisconnected(clientID)));
            }
        });
    });

});