import Channel from "App/Models/Channel";
import ChannelsUser from "App/Models/ChannelsUser";
import User from "App/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'

export async function joinChannel(user_id, channel_id){
    const channel = await Channel.find(parseInt(channel_id));

    if(!channel){
        return null
    }
    const existingUser = await channel.related('users').query().where('user', user_id).first();
    if (!existingUser) {
        await channel.related('users').attach([user_id]);
    } else {
        console.log('User is already attached to the channel');
    }

    return channel
}

//export async function 

export async function leaveChannel(channel_id, user_id, channels, socket){
    const channel = await Channel.find(channel_id);
    const channelSockets = channels.get(channel_id);

    console.log(channel_id)
    console.log(channels)


    if(channel?.owner == user_id){
      await channel?.delete();
      channelSockets.forEach(conn => {
        conn.emit('leave-channel', channel_id)
        });
      channels.delete(channel_id);
    }
    else{
      await channel?.related('users').detach([user_id]);
      socket.emit('leave-channel', channel_id)
      channelSockets.delete(socket);
    }
}

export async function getUserList(channel_id, socket) {
  const usersInfo = [];

  const users = await Database.rawQuery('SELECT users.nickname, users.status FROM users JOIN channels_users ON users.id = channels_users.user WHERE channels_users.channel = ?', [channel_id]);

  for (const user of users) {
    usersInfo.push({
      nickname: user.nickname,
      status: user.status,
    });
  }

  console.log(usersInfo);

  socket.emit('user-list', usersInfo);
}

