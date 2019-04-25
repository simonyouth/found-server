const WebSocket = require('ws');

const PORT = '8081';
const wss = new WebSocket.Server({ port: PORT });

// 用户wss {id: wss}
const clients = {};

// detect and close broken connection
function noop() {}
function heartbeat() {
  this.isAlive = true;
}
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

function initWebSocket() {
  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    console.log('****welcome to use ws*****');
    ws.on('message', (res) => {
      const data = JSON.parse(res);
      // // 会话期间首次连接
      if (isNewConn(data.id)) {
        clients[data.id] = ws;
      }
    });

    ws.on('close', (res) => {
      // 删除对应的客户端
      removeClosed(ws);
      console.log('close..')
    })
  })
}

function isNewConn(id) {
  return !clients.hasOwnProperty(id);
}
function removeClosed(ws) {
  for (const key in clients) {
    if (clients[key] === ws) {
      delete clients[key];
    }
  }
}

function sendMessage(receiver, data) {
  const ws = clients[receiver];
  if (ws) {
    ws.send(JSON.stringify(data))
  }
}

module.exports = {
  initWebSocket,
  sendMessage,
};