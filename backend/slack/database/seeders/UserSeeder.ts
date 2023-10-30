import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const userData = {
      nickname: 'User1',
      firstname: 'First1',
      lastname: 'Last1',
      email: 'user1@example.com',
      password: 'hashedpassword', 
      status: 'active',
      personal_notification: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await Database.table('users').insert(userData);
  }
}
