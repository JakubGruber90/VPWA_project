import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel from 'App/Models/Channel'

export default class ChannelSeeder extends BaseSeeder {
  public async run () {
    const channelsData = [
      {
        name: 'Hello',
        type: 'public' as 'public',
        owner: 1, 
      },
      {
        name: 'Goodbye',
        type: 'private' as 'private',
        owner: 1,
      },
     
    ];
    await Channel.createMany(channelsData);
  }
}
