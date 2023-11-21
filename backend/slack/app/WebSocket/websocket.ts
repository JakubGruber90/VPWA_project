import Ws from './Ws'

import { joinChannel, leaveChannel, getUserList } from 'App/services/ChannelServices';
import { getChannelMessages, sendMessage } from 'App/services/MessageServices';
import { decodeToken} from "App/services/AuthServices"
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import ChannelsUser from 'App/Models/ChannelsUser';
import Message from 'App/Models/Message';

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

  socket.on('get-messages', async (channel_id ) => {
    try {
      const messages = await getChannelMessages(channel_id);
      socket.emit('channel-messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
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
      return;
    }
    /*
    if(message.startsWith("/invite ")) {
      const wordsArray = message.split(' ');

      if (wordsArray.length >= 2) {
        const nickname = wordsArray[1];

        const user = await User.query().where('nickname', nickname).first();
        if(!user){
          socket.emit('invite', "User does not exist"); 
          return
        }

        const channel = await Channel.query().where('id', channel_id).first();
        const isPrivate = channel?.type === "private" ? "private" : "public"
        const owner = channel?.owner as string
        const newUserId = user.id as number
        
        if(isPrivate == "private") {

          if (owner === user_id) {
            
            const invitedUserSocket = users.get(nickname);
            
            if (invitedUserSocket) {
              invitedUserSocket.emit('invite', channel);

              const newData = new ChannelsUser();
              newData.fill({
                channel: channel_id,
                user: newUserId,
              });
      
              await newData.save();
            }

          } else {
            socket.emit('invite', "You dont have permission to invite to this channel"); 
            return
          }
        } else {
          
        }
        /*
        const channel = await joinChannel(user.id,channel_id)
    
        const invitedUserSocket = users.get(nickname);
        channelSockets.add(invitedUserSocket);
    
        if (invitedUserSocket) {
          invitedUserSocket.emit('join-channel',  channel);
        } 
        */
       /*
      }
    }
    */
    if(message.startsWith("/join ")) {
      const wordsArray = message.split(' ');
      const isPrivate = wordsArray[2] === "private" ? "private" : "public"
      const channelName = wordsArray[1];
      const userdb = user_id as string
      
      let channel = await Channel.query().where('name', channelName).first();
      let channeldb = channel?.id as number
      
      if (channeldb !== undefined) {
        let isMember = await ChannelsUser.query().where('user', userdb).andWhere('channel', channeldb).first();

        if(isMember){
          socket.emit('join-channel',  "You are already member of this channel");
          return
        }  
      }  
      
      if(channel && channel.type == "private") {
        socket.emit('join-channel',  "You dont have permission to join this channel");
      } else if (channel) {
        //save to channeluserdb
        await channel.related('users').attach([userdb]);
        socket.emit('join-channel',  channel);
      } else {
        const newChannel = new Channel();
        newChannel.fill({
          name: wordsArray[1],
          type: isPrivate,
          owner: userdb
        });

        await newChannel.save(); 
        await newChannel.related('users').attach([userdb]);


        channels.set(newChannel.id, new Set());
        const channelSockets = channels.get(newChannel.id)
        channelSockets.add(socket)

        console.log(channelSockets)

        socket.emit("join-channel", newChannel)
      }

      return;
    }

    if (message.startsWith("/list")) {
      getUserList(channel_id, socket);
      return;
    }

    const new_message = await sendMessage(channel_id, message, user_id);
    //socket.emit('add-new-message', new_message);

    const currChannelSockets = channels.get(channel_id)
    for (var channelSocket in currChannelSockets) {
      console.log(channelSocket);
      channelSocket.emit('add-new-message', new_message);
    }
}
)})

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