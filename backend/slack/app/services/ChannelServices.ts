import Channel from "App/Models/Channel";

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

