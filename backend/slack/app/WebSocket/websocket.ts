import Ws from './Ws'

import { joinChannel, leaveChannel, getUserList } from 'App/services/ChannelServices';
import { getChannelMessages, sendMessage } from 'App/services/MessageServices';
import { decodeToken} from "App/services/AuthServices"
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import ChannelsUser from 'App/Models/ChannelsUser';
import Database from '@ioc:Adonis/Lucid/Database';

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

    if(message.startsWith("/invite ")) {
      const wordsArray = message.split(' ');
      const nickname = wordsArray[1];
      const channel = await Channel.query().where('id', channel_id).first();
      const userToInvite = await User.query().where('nickname', nickname).first();

      if (!userToInvite) {
        socket.emit('invite', 'User does not exist');
        return
      }

      const userToInviteString = userToInvite?.id as string
      const channelUser = await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToInviteString).first();

      if (channelUser) {
        socket.emit('invite', 'User is already member of this channel');
        return
      }

      if (channel) {
        if (channel.type === "private") {
          const owner = channel.owner as string
          if (owner !== user_id) {
            socket.emit('invite', 'You do not have permission to invite to this channel');
            return
          } else {
            const userSocket = users.get(nickname);
            
            if (userSocket) {
              userSocket.emit('invite', channel);
            }
  
            const newChannel = new ChannelsUser();
            newChannel.fill({
              channelId: channel_id,
              userId: userToInvite.id as unknown as number,
              kickVotes: 0,
            });
    
            await newChannel.save();
          }
          return
        } else {
          const userSocket = users.get(nickname);
            
          if (userSocket) {
            userSocket.emit('invite', channel);
          }

          const newChannel = new ChannelsUser();
          newChannel.fill({
            channelId: channel_id,
            userId: userToInvite.id as unknown as number,
            kickVotes: 0,
          });
  
          await newChannel.save();
        }       
      }
    }
    
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

        socket.emit("join-channel", newChannel)
      }

      return;
    }

    if (message.startsWith("/list")) {
      getUserList(channel_id, socket);
      return;
    }

    if (message.startsWith("/quit")) {
      const user = user_id as string
      const channel = await Channel.query().where('owner', user).andWhere('id', channel_id).first();

      if(channel) {
        let usernames: any = [];

        const usersIds = await Database.rawQuery('select user from channels_users where channel = ?', [channel_id])
      
        await Promise.all(usersIds.map(async (userid) => {
          const name = await Database.rawQuery('select nickname from users where id = ?', [userid.user])
          console.log(name[0]?.nickname)
          usernames.push(name[0]?.nickname)
        }));

        await Channel.query().where('id', channel_id).delete();
        await ChannelsUser.query().where('channel', channel_id).delete();

        console.log(usernames)

        for (const name of usernames) {
          const userSocket = users.get(name);
          if (userSocket) {
            userSocket.emit('leave-channel', channel_id);
          }
        }
      } else {
        socket.emit('leave-channel', 'You do not have permission to delete this channel');
      }
    }

    if (message.startsWith("/revoke ")) {
      const wordsArray = message.split(' ');
      const nickname = wordsArray[1];
      const user = user_id as string
      const channel = await Channel.query().where('owner', user).andWhere('id', channel_id).first();
      const userToRemove = await User.query().where('nickname', nickname).first();
      const userToRemoveString = userToRemove?.id as string
      const channelUser = await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToRemoveString).first();

      if (!userToRemove) {
        socket.emit('revoke', 'User does not exist');
        return
      }

      if (!channelUser) {
        socket.emit('revoke', 'User is not member of this channel');
        return
      }

      if(channel) {
        const userSocket = users.get(nickname);
        if (userSocket) {
          userSocket.emit('revoke', channel_id);
        }
        await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToRemoveString).delete();
      } else {
        socket.emit('revoke', 'You do not have permission to remove this user');
      }
    }

    const new_message = await sendMessage(channel_id, message, user_id);
    const currChannelSockets = channels.get(channel_id)

    currChannelSockets.forEach(channelSocket => {
      channelSocket.emit('add-new-message', new_message);
    });

    /*for (var channelSocket in currChannelSockets) {
      console.log(channelSocket);
      channelSocket.emit('add-new-message', new_message);
    }*/
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