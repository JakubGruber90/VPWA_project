// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Database from '@ioc:Adonis/Lucid/Database'
import Channel from 'App/Models/Channel'

class HomeController {
  async index () {
    const channels = await Channel.all(); // model syntax
    return channels;

    //const data = await Database.from('users').select('*')  db syntax
    // await Database.table('users').insert({ /* Your data object for insertion */ });#
    // await Database.table('users').where({ /* Your conditions for deletion */ }).delete();
    //return data
  }
}

module.exports = HomeController