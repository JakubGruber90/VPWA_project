import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class KickUser extends BaseModel {
    public static table = 'kick_users'
  
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public userToKick: number
  
    @column()
    public voteFrom: number
  
    @belongsTo(() => User, {
      localKey: 'userToKick',
      foreignKey: 'user',
    })

    @belongsTo(() => User, {
        localKey: 'voteFrom',
        foreignKey: 'user',
      })

    public user: BelongsTo<typeof User>
  }