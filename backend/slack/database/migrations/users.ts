import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('nickname', 15).unique().notNullable()
      table.string('firstname', 20).notNullable()
      table.string('lastname', 20).notNullable()
      table.text('email').notNullable().unique()
      table.text('password').notNullable()
      table.enu('status', ['online', 'offline', 'dnd']).defaultTo('online')
      table.boolean('personal_notification').defaultTo(true)
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

