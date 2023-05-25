import { type AddAccountRepository } from '../../../../data/protocols'
import { type AccountModel } from '../../../../domain/models'
import { type AddAccountModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers'

interface AccountDocument {
  name: string
  email: string
  password: string
}

export class AccountMongoRepository implements AddAccountRepository {
  public async add ({ email, name, password }: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection<AccountDocument>('accounts')
    const { insertedId } = await accountCollection.insertOne({ email, name, password })
    return {
      id: insertedId.toHexString(),
      email,
      name,
      password
    }
  }
}
