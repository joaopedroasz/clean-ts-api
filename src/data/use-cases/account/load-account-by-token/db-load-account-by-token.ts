import type {
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository
} from './protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  public async load ({ token, role }: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    try {
      const accessToken = await this.decrypter.decrypt(token)
      if (!accessToken) return undefined
    } catch (error) {
      return undefined
    }

    const account = await this.loadAccountByTokenRepository.loadByToken({ token, role })
    if (!account) return undefined

    return account
  }
}
