import Ws from './Ws'

import { joinChannel, leaveChannel, getUserList } from 'App/services/ChannelServices';
import { sendMessage } from 'App/services/MessageServices';
import { decodeToken } from "App/services/AuthServices"
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import Notification from 'App/Models/Notification';
import ChannelsUser from 'App/Models/ChannelsUser';
import Database from '@ioc:Adonis/Lucid/Database';
import KickUser from 'App/Models/KickUsers';
import commands from 'commands';

Ws.boot()


const users = new Map(); 
const channels = new Map()

Ws.io.on('connection', async (socket) => {

  users.set(socket.handshake.query.user_name, socket);
  const user = await User.find(socket.handshake.query.user_id);
  if(user){
    const userChannels = await user.related('channels').query();
    userChannels.forEach((channel) => {
      const channelId = channel.id

      const channelSet = channels.get(channelId) || new Set();
      channelSet.add(socket);
      channels.set(channelId, channelSet);
    })
  }

  socket.on('disconnect', () => {
    for (const [key, value] of users.entries()) {
      if (value === socket) {
        users.delete(key);
        break; 
      }
    }

    channels.forEach((channel) => {
      if (channel.has(socket)) {
        channel.delete(socket);
      }
    });

  });
  
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


    socket.emit("create-channel", newChannel)

  });

  socket.on('suggestChannels', async() => {
    let channels = await Channel.query().where('type', 'public');

    const channelNames = channels.map(channel => channel.$attributes.name);

    socket.emit("suggestChannels", channelNames)
  });


   socket.on('join', async ({channel_id, nickname}) => {
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

  });

  socket.on('leave', async ({channel_id }) => {

    channel_id = parseInt(channel_id)
    const user_id = socket.handshake.query.user_id

    leaveChannel(channel_id, user_id, channels, socket)
  });

  socket.on("notification", async({channel_id, sender, message})=> {
    const user = await User.findBy("nickname", sender);

    if (user) {
  
      const notification = new Notification();       
      notification.text = message;
      notification.recipient = user.id;
      notification.channel = channel_id;
      await notification.save(); 
      
      socket.emit("notification-send", notification,sender)
      
    }
  })
  

  socket.on('chatTyping', async ({message, channel_id}) => {
    channel_id = parseInt(channel_id)
    const user_id = socket.handshake.query.user_id as string

    const userdb = await User.query().where('id', user_id).first();
    const channel = await Channel.query().where('id', channel_id).first();
    const user = userdb?.nickname as string
    
    const channelSockets = channels.get(channel?.id)
    
    console.log(channels)
    /*
    channelSockets.forEach(channelSocket => {
      channelSocket.emit('chatTyping', {message, user});
    });
    */
  })
  
  socket.on('message', async ({channel_id, message}) => {
    channel_id = parseInt(channel_id)
    const user_id = socket.handshake.query.user_id

    if (message.startsWith("/kick ")) {
      const wordsArray = message.split(' ');
      const nickname = wordsArray[1];

      const user = user_id as string
      const channelOwner = await Channel.query().where('owner', user).andWhere('id', channel_id).first();
      const userToKick = await User.query().where('nickname', nickname).first();
      const userToKickString = userToKick?.id as string

      if (!userToKick) {
        socket.emit('kick', 'User does not exist');
        return
      }

      const channelUser = await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToKickString).first();

      const userVoteKick = await User.query().where('id', user).first();

      if (userVoteKick?.nickname === nickname) {
        socket.emit('kick', 'You cannot kick yourself, use /cancel to leave channel or /quit to delete channel');
        return
      }

      if (!channelUser) {
        socket.emit('kick', 'User is not member of this channel');
        return
      }

      if(channelOwner) {
        const userSocket = users.get(nickname);
        if (userSocket) {
          userSocket.emit('kick', channel_id);
        }
        await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToKickString).delete();
        return;
      } else {
        const userVotes = await KickUser.query().where('userToKick', userToKickString).first();

        const userVoteToKick = await KickUser.query().where('userToKick', userToKickString).andWhere('voteFrom', user).first();

        return;
      }
    }
    
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
            socket.emit('invite', channel);

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
          let sockets = channels.get(channel_id);
          sockets.add(userSocket);
            
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
      return
    }
    
    if(message.startsWith("/join ")) { 
      const arrayUnFiltered = message.split(' ');
      const wordsArray = arrayUnFiltered.filter(word => word.trim() !== '');
      const isPrivate = wordsArray[2] === "private" ? "private" : "public"
      let channelName = wordsArray[1];

      if (wordsArray.length < 2) {
        socket.emit('join-channel',  "Channel name cannot be empty");
        return
      }

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

        const channelSockets = channels.get(channel.id)
        channelSockets.add(socket)

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
          usernames.push(name[0]?.nickname)
        }));

        await Channel.query().where('id', channel_id).delete();
        await ChannelsUser.query().where('channel', channel_id).delete();

        for (const name of usernames) {
          const userSocket = users.get(name);
          if (userSocket) {
            userSocket.emit('leave-channel', channel_id);
          }
        }

        return;
      } else {
        socket.emit('leave-channel', 'You do not have permission to delete this channel');
        return;
      }
    }

    if (message.startsWith("/revoke ")) {
      const wordsArray = message.split(' ');
      const nickname = wordsArray[1];

      const user = user_id as string
      const channel = await Channel.query().where('owner', user).andWhere('id', channel_id).first();
      const userToRemove = await User.query().where('nickname', nickname).first();
      const userToRemoveString = userToRemove?.id as string

      if (!userToRemove) {
        socket.emit('revoke', 'User does not exist');
        return
      }

      const channelUser = await ChannelsUser.query().where('channel', channel_id).andWhere('user', userToRemoveString).first();

      const owner = await User.query().where('id', user).first();

      if (owner?.nickname === nickname) {
        socket.emit('revoke', 'You cannot remove yourself, use /cancel to leave channel or /quit to delete channel');
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
        return;
      } else {
        socket.emit('revoke', 'You do not have permission to remove this user');
        return;
      }
    }

    //Poslanie spravy, ak input neobsahuje keywork pre command
    const new_message = await sendMessage(channel_id, message, user_id); 

    if (!channels.has(channel_id)) {
      channels.set(channel_id, new Set());
    } 

    const channelSockets = channels.get(channel_id);
    if (socket && !channelSockets.has(socket)) {
      channelSockets.add(socket);
    }
  
    channelSockets.forEach(channelSocket => {
      channelSocket.emit('add-new-message', new_message);
    });
}
)})
