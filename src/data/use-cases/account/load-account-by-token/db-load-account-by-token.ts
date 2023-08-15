import {
  type LoadAccountByToken,
  type Decrypter,
  type LoadAccountByTokenRepository,
  type LoadAccountByTokenModel,
  type AccountModel
} from './protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  public async load ({ token, role }: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
    const accessToken = await this.decrypter.decrypt(token)
    if (!accessToken) return undefined

    const account = await this.loadAccountByTokenRepository.loadByToken({ token, role })
    if (!account) return undefined

    return account
  }
}
