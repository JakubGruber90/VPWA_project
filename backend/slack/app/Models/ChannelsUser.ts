import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class ChannelsUser extends BaseModel {
  public static table = 'channels_users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public channelId: number

  @column()
  public kickVotes: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'userId',
    foreignKey: 'user',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    localKey: 'channelId',
    foreignKey: 'channel',
  })
  public channel: BelongsTo<typeof Channel>
}