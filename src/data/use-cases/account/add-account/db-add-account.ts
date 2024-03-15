import {
  type Hasher,
  type AccountModel,
  type AddAccount,
  type AddAccountParams,
  type AddAccountRepository,
  type LoadAccountByEmailRepository
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add ({ password, email, name }: AddAccountParams): Promise<AccountModel | undefined> {
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
