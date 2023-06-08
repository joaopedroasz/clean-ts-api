import { type Hasher, type AccountModel, type AddAccount, type AddAccountModel, type AddAccountRepository } from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  public async add ({ password, email, name }: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.hasher.hash(password)
    return await this.addAccountRepository.add({
      email,
      name,
      password: encryptedPassword
    })
  }
}
