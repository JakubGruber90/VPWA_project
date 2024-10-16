import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Channel extends BaseModel {
  public static table = 'channels'

  @manyToMany(() => User,{
    pivotTable: 'channels_users',
    pivotForeignKey: 'channel', 
    pivotRelatedForeignKey: 'user'
  })
  public users: ManyToMany<typeof User>


  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: 'public' | 'private'

  @column()
  public owner: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'owner',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>
}
