import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
import User from 'App/Models/User'
import messages from 'Database/migrations/messages';

class MessageController {
  async index () {
    const messages = await Message.all(); // model syntax
    return messages;

  }

  async handle_input ({request}: HttpContextContract) {
    const data = request.all();
    console.log(data);

  }

  async user_nick({params}: HttpContextContract) { //maybe useless
    const userId = params.userId;
    const user = await User.findOrFail(userId);
    console.log("\n|USER NICK|\n", user.nickname);
    return user.nickname;
  }
}


module.exports = MessageController