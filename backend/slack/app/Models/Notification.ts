import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Notification extends BaseModel {
  public static table = 'notifications'

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public recipient: number

  @column()
  public channelId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'recipient',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    localKey: 'channelId',
    foreignKey: 'id',
  })
  public channel: BelongsTo<typeof Channel>
}
