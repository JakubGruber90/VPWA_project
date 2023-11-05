import Channel from 'App/Models/Channel';
const { parse, verify } = require('jsonwebtoken');


class ChannelsController {
  async index ({request, params, response}) {
    const header = request.headers().authorization;

    if (header) {
      const token = header.replace('Bearer ', ''); 
      const secret = 'yssY/pkzyj6qrUUpaNChjX5AXlD7z3OdCIgHRdeabPlbplrkZpc2c2Bae+BO/sdL24zzyOgTJCWN8TpIlnquNA=='; 

      try {
        const decodedToken = verify(token, secret);
        const id = decodedToken.sub;
        const channelId = params.id

        const channel = await Channel.find(channelId);
        console.log(id, channel?.owner)
        if(channel?.owner !== id){
          return response.status(403)
        }

        return response.status(200).json({
          id: id,
        });
      } catch (error) {
        console.error('JWT verification failed:', error);
        return null; 
      }
    }

    return null; 
  }


  async leaveChannel ({request, params}) {

        return request

      }
}

module.exports = ChannelsController