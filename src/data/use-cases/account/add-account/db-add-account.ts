import type {
  Hasher,
  AddAccount,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add ({ password, email, name }: AddAccount.Params): Promise<AddAccount.Result> {
    const existentAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (existentAccount) return false
    const encryptedPassword = await this.hasher.hash(password)
    await this.addAccountRepository.add({
      email,
      name,
      password: encryptedPassword
    })
    return true
  }
}
