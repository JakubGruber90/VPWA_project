import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel from 'App/Models/Channel'

export default class ChannelSeeder extends BaseSeeder {
  public async run () {
    const channelsData = [
      {
        name: 'Hello',
        type: 'public' as 'public',
        owner: "8cf2bb75-d159-4363-9753-1c3c0de32060", 
      },
      {
        name: 'Goodbye',
        type: 'private' as 'private',
        owner: "2c37cea0-8d57-463e-878a-2520ffd266c1",
      },
     
    ];
    await Channel.createMany(channelsData);
  }
}
