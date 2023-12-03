// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'

export default class NotificationsController {


    async create({ params, request, response }) {
        const notificationData = request.all();
        const channel_id = params.channel_id;

        const notification = new Notification();
        notification.fill({
          text: notificationData.text,
          recipient: notificationData.user_id,
          channelId: notificationData.channel_id
        });

        await notification.save(); 
        return response.status(201).json({
            notification: notification, 
           });
      }


}
