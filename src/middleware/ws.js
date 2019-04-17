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
      // if (isNewConn(data.id)) {
        clients[data.id] = ws;
      // }
console.log(data)
      //
    })
  })
}

function isNewConn(id) {
  return !clients.hasOwnProperty(id);
}

function sendMessage(id) {
  const ws = clients[id];
  // console.log(ws.readyState)
  if (ws) {
    ws.readyState === 1 ? ws.send('有消息啦') : delete clients[id];
  }
    // ( ws && ws.isAlive) ? ws.send('有消息啦') : delete clients[id];
}

module.exports = {
  initWebSocket,
  sendMessage,
};