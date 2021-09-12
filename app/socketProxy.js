const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/codecollabserver', createProxyMiddleware({
    target: 'http://localhost:5000', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        '^/codecollabserver': '/codeCollab-socket', // rewrite path
    }
}));

app.use('/diffsyncserver', createProxyMiddleware({
    target: 'http://localhost:5001', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        '^/diffsyncserver': '/diffSync-socket', // rewrite path
    }
}));

app.use('/peerjsserver', createProxyMiddleware({
    target: 'http://localhost:5002', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        '^/peerjsserver': '/peerServer', // rewrite path
    }
}));

app.listen(process.env.PORt, () => console.log("The socket proxy server is listening @PORT:", process.env.PORT));