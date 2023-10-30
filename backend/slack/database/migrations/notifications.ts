import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName,  (table) => {
      table.increments('id').primary()
      table.text('text')
      table.integer('recipient').references('users.id').onDelete('CASCADE')
      table.integer('channel').references('channels.id').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
