// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Message from 'App/Models/Message'

class MessageController {
  async index () {
    const messages = await Message.all(); // model syntax
    return messages;

  }

  async handle_input ({request}) {
    const data = request.all();
    console.log(data);

  }
}

module.exports = MessageController