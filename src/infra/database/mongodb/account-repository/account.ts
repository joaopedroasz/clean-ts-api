import { type ObjectId } from 'mongodb'
import { type AddAccountRepository } from '../../../../data/protocols'
import { type AccountModel } from '../../../../domain/models'
import { type AddAccountModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers'

interface AccountDocument {
  _id: ObjectId
  name: string
  email: string
  password: string
}

export class AccountMongoRepository implements AddAccountRepository {
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection<AddAccountModel>('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    return MongoHelper.removeMongoId<AccountDocument>({ ...accountData, _id: insertedId })
  }
}
