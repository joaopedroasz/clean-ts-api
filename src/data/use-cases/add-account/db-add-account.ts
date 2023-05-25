import { type Encrypter, type AccountModel, type AddAccount, type AddAccountModel, type AddAccountRepository } from './protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  public async add ({ password, email, name }: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(password)
    return await this.addAccountRepository.add({
      email,
      name,
      password: encryptedPassword
    })
  }
}
