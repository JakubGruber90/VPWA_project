import Ws from './Ws'

import { joinChannel, leaveChannel } from 'App/services/ChannelServices';
import { decodeToken} from "App/services/AuthServices"
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';

Ws.boot()


const users = new Map(); 
const channels = new Map()

Ws.io.on('connection', async (socket) => {
  users.set(socket.handshake.query.user_name, socket);


  socket.on('create', async ({name, isPrivate}) => {


    const user_id = socket.handshake.query.user_id as string

    const channel = await Channel.query().where('name', name).first();
    if(channel){
      return; // ak existuje
    }
    const type =  isPrivate == false ? "public" : "private"
    const newChannel = new Channel();
    newChannel.fill({
      name: name,
      type: type,
      owner: user_id
    });

    await newChannel.save(); 
    await newChannel.related('users').attach([user_id]);


    channels.set(newChannel.id, new Set());
    const channelSockets = channels.get(newChannel.id)
    channelSockets.add(socket)

    console.log(channelSockets)

    socket.emit("create-channel", newChannel)

    });


/*   socket.on('join', async ({channel_id, nickname}) => {
    channel_id = parseInt(channel_id)
    if (!channels.has(channel_id)) {
      channels.set(channel_id, new Set());
    } 
    const channelSockets = channels.get(channel_id)
     channelSockets.add(socket) 

    const user = await User.query().where('nickname', nickname).first();
    if(!user){
      return 
    }

    const channel = await joinChannel(user.id,channel_id)

    const invitedUserSocket = users.get(nickname);
    channelSockets.add(invitedUserSocket);

    if (invitedUserSocket) {
      invitedUserSocket.emit('join-channel',  channel);
    } 

  }); */

  socket.on('leave', async ({channel_id }) => {

    channel_id = parseInt(channel_id)
    const user_id = socket.handshake.query.user_id

    leaveChannel(channel_id, user_id, channels, socket)


  });
  

  socket.on('message', async ({channel_id, message}) => {
    channel_id = parseInt(channel_id)
    const user_id = socket.handshake.query.user_id
    if(message == "/cancel"){
      leaveChannel(channel_id, user_id, channels, socket)
    }
    if(message.startsWith("/invite ")){
      const wordsArray = message.split(' ');

      if (wordsArray.length >= 2) {
        const nickname = wordsArray[1];
        const channelSockets = channels.get(channel_id)

        const user = await User.query().where('nickname', nickname).first();
        if(!user){
          return 
        }
    
        const channel = await joinChannel(user.id,channel_id)
    
        const invitedUserSocket = users.get(nickname);
        channelSockets.add(invitedUserSocket);
    
        if (invitedUserSocket) {
          invitedUserSocket.emit('join-channel',  channel);
        } 
      }
    }
  })
})






/*        fetch(`http://localhost:3333/channels/${channel_id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json(); 
        } else {
          throw new Error('Failed to leave channel');
        }
      })
      .then((data) => {
        console.log(data)
        this.channels = this.channels.filter((channel:any) => channel.id != channel_id);
        this.closeExitModal();
        if (this.$route.path === `/channels/${channel_id}`) {
          this.$router.push({ path: '/channels' }); // 
        }
      })
      .catch((err) => {
        console.error(err);
      })  */