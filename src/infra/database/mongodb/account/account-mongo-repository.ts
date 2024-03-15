import { ObjectId } from 'mongodb'

import { type AccountModel } from '@/domain/models'
import { type AddAccountParams } from '@/domain/use-cases'
import {
  type LoadAccountByEmailRepository,
  type AddAccountRepository,
  type UpdateAccessTokenRepository,
  type UpdateAccessTokenInput,
  type LoadAccountByTokenRepository,
  type LoadAccountByTokenInput
} from '@/data/protocols'
import { MongoHelper } from '../helpers'

export type AccountDocument = {
  name: string
  email: string
  password: string
  accessToken?: string
  role?: string
}

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  private readonly collectionName = 'accounts'

  public async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>(this.collectionName)
    const { insertedId } = await accountCollection.insertOne(accountData)
    return MongoHelper.removeMongoId<AccountDocument>({ ...accountData, _id: insertedId })
  }

  public async loadByEmail (email: string): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>(this.collectionName)
    const account = await accountCollection.findOne({ email })
    if (!account) return undefined
    return MongoHelper.removeMongoId<AccountDocument>(account)
  }

  public async updateAccessToken ({ id, token }: UpdateAccessTokenInput): Promise<void> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>(this.collectionName)
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }

  public async loadByToken ({ token, role }: LoadAccountByTokenInput): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>(this.collectionName)
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    if (!account) return undefined
    return MongoHelper.removeMongoId<AccountDocument>(account)
  }
}
