import { ObjectId } from 'mongodb'
import {
  type LoadAccountByEmailRepository,
  type AddAccountRepository,
  type UpdateAccessTokenRepository,
  type UpdateAccessTokenInput,
  type LoadAccountByTokenRepository,
  type LoadAccountByTokenModel
} from '../../../../data/protocols'
import { type AccountModel } from '../../../../domain/models'
import { type AddAccountModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers'

export interface AccountDocument {
  name: string
  email: string
  password: string
  accessToken?: string
  role?: string
}

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    return MongoHelper.removeMongoId<AccountDocument>({ ...accountData, _id: insertedId })
  }

  public async loadByEmail (email: string): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    const account = await accountCollection.findOne({ email })
    if (!account) return undefined
    return MongoHelper.removeMongoId<AccountDocument>(account)
  }

  public async updateAccessToken ({ id, token }: UpdateAccessTokenInput): Promise<void> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }

  public async loadByToken ({ token, role }: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    const account = await accountCollection.findOne({ accessToken: token, role })
    if (!account) return undefined
    return MongoHelper.removeMongoId<AccountDocument>(account)
  }
}
