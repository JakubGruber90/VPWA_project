import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const userData = {
      nickname: 'jozo',
      firstname: 'First1',
      lastname: 'Last1',
      email: 'jozo@jozo.sk',
      password: '123456', 
      status: 'active' as 'active',
      personal_notification: false
    };

    await User.create(userData)
  }
}
