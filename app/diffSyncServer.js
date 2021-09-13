const io = require('socket.io');
const diffSync = require("diffsync");

const initializeDiffSyncService = httpServer => {
    const socket = io(httpServer,{
        path: "/diffSync-socket",
        cors: {
            origin: "*",
            methods: "*"
        }
    });
    const dataAdapter = new diffSync.InMemoryDataAdapter(socket);

    return { dataAdapter, socket };
}

module.exports =  { initializeDiffSyncService }