import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Message extends BaseModel {
  public static table = 'messages'

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public sender: number

  @column()
  public channel: number // Rename this to avoid conflict

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'sender',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    localKey: 'channel',
    foreignKey: 'id',
  })
  public channel: BelongsTo<typeof Channel>
}