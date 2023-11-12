import { DateTime } from 'luxon';
import Channel from '../Models/Channel';

class CheckChannel {
    async run() {
        console.log("a")
        const thirtyDays = 10000;
        const channels = await Channel.all();

        const currentDate = DateTime.now();

        channels.forEach(async (channel, channelName) => {
            const updatedAtDate = DateTime.fromJSDate(channel.updatedAt.toJSDate());
            const daysDifference = currentDate.diff(updatedAtDate, 'days').toObject().days;
        
            if (daysDifference && daysDifference > thirtyDays) {
                await channel.delete();
                console.log(`Channel "${channelName}" deleted due to inactivity.`);
            }
        });
    }

}
  

  module.exports = CheckChannel;