import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Channel from './Channel'

export default class User extends BaseModel {
  public static table = 'users'

  @manyToMany(() => Channel,{
    pivotTable: 'channels_users',
    pivotForeignKey: 'user', 
    pivotRelatedForeignKey: 'channel'
  })
  public channels: ManyToMany<typeof Channel>

  @column({ isPrimary: true })
  public id: string

  @column()
  public nickname: string

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public status: 'online' | 'offline' | 'dnd'

  @column()
  public personal_notification: boolean

  @column.dateTime()
  public createdAt: DateTime

  @column.dateTime()
  public updatedAt: DateTime
}
