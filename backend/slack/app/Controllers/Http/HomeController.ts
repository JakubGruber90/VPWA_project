// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

class HomeController {
  async index () {

const data = await Database.from('users').select('*')
// await Database.table('users').insert({ /* Your data object for insertion */ });#
// await Database.table('users').where({ /* Your conditions for deletion */ }).delete();



    return data
  }
}

module.exports = HomeController