import Ws from './Ws'
Ws.boot()


const online_users = new Map(); // here will be stored all users


Ws.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'wdorld' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})