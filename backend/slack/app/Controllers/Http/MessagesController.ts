import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
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
}

module.exports = MessageController