import { DateTime } from 'luxon';
import Channel from "../Models/Channel.ts"
import ChannelsUser from 'App/Models/ChannelsUser';
var cron = require('node-cron');

import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'
import Message from 'App/Models/Message';
/* import Ws from '../WebSocket/Ws'
Ws.boot()
console.log(Ws.io.sockets.sockets.size) */

export default class ChannelCheck extends BaseTask {
  public static get schedule() {
		// Use CronTimeV2 generator:
    return CronTimeV2.everyTenSeconds()
		// or just use return cron-style string (simple cron editor: crontab.guru)
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmp/adonis5-scheduler/locks/your-class-name`
   */
  public static get useLock() {
    return false
  }

  public async handle() {

    const thirtyDays = 2592000 ;
    const latestRecords = await Message.query().select('*').max('created_at').groupBy('channel');


    latestRecords.forEach(async (latestRecord) => {
      if(latestRecord.channel == null){
        return
      }
      const lastUpdate = new Date(latestRecord.$extras['max(`created_at`)']).getTime() / 1000
      const currentDate = DateTime.now();
      const timestampInMs = currentDate.valueOf() / 1000;

      console.log(latestRecord.channel, timestampInMs - lastUpdate)

        if (timestampInMs - lastUpdate > thirtyDays) {
          const channel = Channel.find(latestRecord.channel)
          await Channel.query().where('id', latestRecord.channel).delete();

          //Ws.io.sockets.emit('leave-channel', channel);
          console.log(`Channel ${latestRecord.channel} deleted due to inactivity.`);
        }
    });
  }
}
