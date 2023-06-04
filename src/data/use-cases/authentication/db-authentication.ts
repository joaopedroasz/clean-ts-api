import { type AuthenticationModel, type Authentication } from '../../../domain/use-cases'
import { type HashCompare, type LoadAccountByEmailRepository } from '../../protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return undefined

    await this.hashCompare.compare({ plainText: password, hash: account.password })
  }
}
