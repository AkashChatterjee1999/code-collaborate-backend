const { createServer } = require("http");
const { WebSocketServer } = require('ws');
const {initializeCodeCollabService, availableRoomIDs} = require("./codeCollabServer");
const diffSync = require("diffsync");
const { initializeDiffSyncService } = require("./diffSyncServer");
const express = require("express");

const app = express()
const server = createServer(app);

const { dataAdapter, socket } = initializeDiffSyncService(server);
let diffSyncServer = new diffSync.Server(dataAdapter, socket);

const codeCollabServer = new WebSocketServer({ server, path: "/codeCollab-socket", secure: true });
initializeCodeCollabService(codeCollabServer);

app.get("/api/v1/roomID/validate/:roomID", (req, res) => {
    let roomID = req.params.roomID;
    if(availableRoomIDs.includes(roomID)) {
        res.status(200);
        res.send({
            roomID, "status": "valid"
        });
    } else {
        res.status(400);
        res.send({
            "status": "invalid"
        });
    }
});

server.listen(process.env.PORT, () => console.log("Code collaborate server started @PORT:", process.env.PORT));