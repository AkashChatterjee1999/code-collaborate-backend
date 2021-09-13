const { createServer } = require("http");
const { WebSocketServer } = require('ws');
const {initializeCodeCollabService} = require("./codeCollabServer");
const diffSync = require("diffsync");
const { initializeDiffSyncService } = require("./diffSyncServer");
const express = require("express");

const app = express()
const server = createServer(app);

const { dataAdapter, socket } = initializeDiffSyncService(server);
let diffSyncServer = new diffSync.Server(dataAdapter, socket);

const codeCollabServer = new WebSocketServer({ server, path: "/codeCollab-socket", secure: true });
initializeCodeCollabService(codeCollabServer);

server.listen(process.env.PORT, () => console.log("Code collaborate server started @PORT:", process.env.PORT));