const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/graphql');

ws.on('open', function open() {
  console.log('WebSocket connected');
  ws.send(JSON.stringify({
    type: 'connection_init',
    payload: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtYTcyNG83dDAwMDIwcWRjaHhkb20wc2UiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NjIwOTE5MSwiZXhwIjoxNzQ2MjEyNzkxfQ.NJ8OONgRzGmS1DChdbowuf8I1iS9cjL4zJdZiDnSAQE' 
    }
  }));
});

ws.on('message', function incoming(data) {
  console.log('Received:', data);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', function close() {
  console.log('WebSocket connection closed');
});
