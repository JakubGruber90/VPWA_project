import Channel from 'App/Models/Channel';
import User from 'App/Models/User';
import Message from 'App/Models/Message';
import ChannelsUser from 'App/Models/ChannelsUser';
import { channels } from 'App/WebSocket/websocket';

const { parse, verify } = require('jsonwebtoken');


class ChannelsController {
  async index ({request, params, response}) {
  
    const userId = request.userId
      try {
        const channelId = params.id
        const channel = await Channel.find(channelId);

        if (!channel) {
          return response.status(404).json({ error: 'Channel not found' });
        }
    
      
        const user = await channel.related('users').query().where('users.id', userId).first();

        console.log(user)
      
        if (!user) {
          return response.status(403).json({ error: 'User is not related to the channel' });
        }
      
        return response.status(200).json({
          id: userId,
        });

      } catch (error) {
          return response.status(400)
      }
  
  }


  async leaveChannel({ request, params, response }) {
    try {
      const userId = request.userId
      const channelId = params.id;

      const channel = await Channel.find(channelId);
      const userChannels = await User.query().first();

      if (!channel) {
        return response.status(404).json({ error: 'Channel not found' });
      }

      if (channel.owner === userId) {
        await channel.related('users').detach();
        await channel.delete();
      } else {
        await channel.related('users').detach([userId]);
      }
  
      return response.status(200).json({ msg: 'ok' });
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: 'An error occurred while leaving the channel' });
    }
  }

      async getChannels ({request, params, response}) {
        const header = request.headers().authorization;
        const user = await User.find(request.userId);
        await user?.load('channels');
        if(user){
          const channels = user.$getRelated('channels');
          return response.status(200).json({
            channels
          }); 
        }
      }

      async createChannel ({request, params, response}) {
        const user_id = request.userId
        const {name, isPrivate} = request.all()       
          try {
            const channel = await Channel.query().where('name', name).first();
            if(channel){
              return response.status(400);
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
            
            return response.status(201).json({
              newChannel
            });
          } catch (error) {
            console.log(error);
            return null; 
          }
      }

      async getInitialMessages ({request, params, response}) {
        const channel_id = params.id;

        const messages = await Message.query().where('channel', channel_id).orderBy('created_at', 'desc').limit(20);
        var color;

        const updatedMessages = await Promise.all(messages.map(async (message) => {
          const user = await User.findOrFail(message.sender);
          if(user.status === 'online') {
            color = 'light-green-14';
          } else if(user.status === 'dnd') {
            color = 'red';
          } else {
            color = 'grey';
          }

          return {...message.toJSON(), sender: user?.nickname, badgeColor: color}
      }));

        return updatedMessages.reverse();
      }

      async getOlderMessages ({request, params, response}) {
        const channel_id = parseInt(request.qs().channel_id);
        const start = parseInt(request.qs().start);
        const limit = parseInt(request.qs().limit);
      
        const messages = await Message.query().where('channel', channel_id).orderBy('created_at', 'desc').offset(start).limit(limit);
        var color;

        const updatedMessages = await Promise.all(messages.map(async (message) => {
          const user = await User.findOrFail(message.sender);
          if(user.status === 'online') {
            color = 'light-green-14';
          } else if(user.status === 'dnd') {
            color = 'red';
          } else {
            color = 'grey';
          }
          
          return {...message.toJSON(), sender: user?.nickname, badgeColor: color}
      }));

        return updatedMessages.reverse();
      }
}

module.exports = ChannelsController