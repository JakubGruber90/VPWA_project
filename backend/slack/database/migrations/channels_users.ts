import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'channels_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user').references('users.id').notNullable().onDelete('CASCADE')
      table.integer('channel').references('channels.id').notNullable().onDelete('CASCADE')
      table.integer('kick_votes')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
