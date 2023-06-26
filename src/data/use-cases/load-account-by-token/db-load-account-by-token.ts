import { type AccountModel } from '../../../domain/models'
import { type LoadAccountByToken, type LoadAccountByTokenModel } from '../../../domain/use-cases'
import { type Decrypter } from '../../protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  public async load ({ token }: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
    await this.decrypter.decrypt(token)
  }
}
