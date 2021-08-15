const ws = require("ws");
const uuid = require("uuidv4");
const server = new ws.Server({ host: "localhost", port: "5050" });
let clientMap = new Map();
let clientInfo = new Map();

functionalMap = {
    onOpenAcknowledgement: id => {
        let connectedClients = [];
        clientInfo.forEach((client, clientId) => {
            connectedClients.push({
                clientId, name: client.name, profilePic: client.profilePic, location: client.clientLocation, email: client.clientEmail
            })
        });
        return {"responseEvent": "OPEN", "responseType": "acknowledge", "metadataData": { id, connectedClients }}
    },
    onClientDisconnected: clientID => {
        return {"responseEvent": "CLIENT_DISCONNECTED", "responseType": "info", "data": { clientID }}
    },
    onClientJoined: (clientID, clientName, profilePic, location, email) => {
        return {"responseEvent": "CLIENT_CONNECTED", "responseType": "info", "data": { clientID, clientName, profilePic, location, email }}
    },
    acknowledgeClientInfo: (id) => {
        return {"responseEvent": "ACKNOWLEDGE_CLIENT_INFO", "responseType": "acknowledge", "data": { id }}
    }
}

initializeClient = ws => {
    let clientId = uuid.uuid();
    clientMap.set(clientId, ws);
    return functionalMap.onOpenAcknowledgement(clientId);
}

checkEmailExistedThenReturnId = (email) => {
    console.log("This Email to be checked: ", email);
    if(email === null || email=== undefined || !email) return undefined;
    let keys = Array.from(clientInfo.keys());
    for(let i=0; i<keys.length; i++) {
        let value = clientInfo.get(keys[i]), key = keys[i];
        console.log("lol", value.clientEmail.toString().trim().toLowerCase(), "lol1:", email.toString().trim().toLowerCase());
        console.log(value.clientEmail.toString().trim().toLowerCase() === email.toString().trim().toLowerCase())
        if(value.clientEmail.toString().trim().toLowerCase() === email.toString().trim().toLowerCase()) {
            console.log("Here is the key: ", key);
            return key;
        }
    }
    return undefined;
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
     * Scenario1: Whenever we see that a new client ahs joined then do following steps
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
                let clientLocation = data.location;
                let clientEmail = data.clientEmail;

                // check weather this email already existed or not
                let prevClientEmailExistedID = checkEmailExistedThenReturnId(clientEmail);
                console.log("Previous Existed ID: ", prevClientEmailExistedID);
                if(prevClientEmailExistedID) {
                    // re-map the previous client with this clientID
                    clientMap.delete(clientID);
                    clientMap.set(prevClientEmailExistedID, ws);
                    clientID = prevClientEmailExistedID;
                    clientInfo.set(clientID, {name: clientName, profilePic, clientLocation, clientEmail});
                } else {
                    console.log(clientName, "has joined the collaborate");
                    clientInfo.set(clientID, {name: clientName, profilePic, clientLocation, clientEmail});
                }

                ws.send(JSON.stringify(functionalMap.acknowledgeClientInfo(clientID)));

                let clientObj = functionalMap.onClientJoined(clientID, clientName, profilePic, clientLocation, clientEmail);
                let stringifiedJSON = JSON.stringify(clientObj);
                broadCastMessage(stringifiedJSON);

            } else if(data.responseEvent === 'CHAT') {
                console.log("Chat Data: ", data);
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
                console.log(clientInfo.get(clientID)?.name, "has disconnected the collaborate");
                broadCastMessage(JSON.stringify(functionalMap.onClientDisconnected(clientID)));
            }
        });
    });

});