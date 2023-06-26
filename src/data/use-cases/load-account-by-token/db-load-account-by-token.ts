import { type AccountModel } from '../../../domain/models'
import { type LoadAccountByToken, type LoadAccountByTokenModel } from '../../../domain/use-cases'
import { type LoadAccountByTokenRepository, type Decrypter } from '../../protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  public async load ({ token, role }: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
    const accessToken = await this.decrypter.decrypt(token)
    if (!accessToken) return undefined

    await this.loadAccountByTokenRepository.loadByToken({ token, role })
  }
}
