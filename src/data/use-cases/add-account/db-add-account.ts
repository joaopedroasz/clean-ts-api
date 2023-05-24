import { type AccountModel } from '../../../domain/models'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases'
import { type Encrypter } from '../../protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  public async add ({ password }: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(password)
    return {
      id: 'valid_id',
      email: 'valid_email',
      name: 'valid_name',
      password: 'hashed_password'
    }
  }
}
