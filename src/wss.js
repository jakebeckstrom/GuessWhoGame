const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      })
    })
  });

  module.exports = wss;