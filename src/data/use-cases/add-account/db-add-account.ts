import {
  type Hasher,
  type AccountModel,
  type AddAccount,
  type AddAccountModel,
  type AddAccountRepository,
  type LoadAccountByEmailRepository
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add ({ password, email, name }: AddAccountModel): Promise<AccountModel | undefined> {
    const existentAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (existentAccount) return undefined
    const encryptedPassword = await this.hasher.hash(password)
    return await this.addAccountRepository.add({
      email,
      name,
      password: encryptedPassword
    })
  }
}
