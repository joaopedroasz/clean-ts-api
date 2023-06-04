import { type AuthenticationModel, type Authentication } from '../../../domain/use-cases'
import { type LoadAccountByEmailRepository } from '../../protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    await this.loadAccountByEmailRepository.load(email)
    return undefined
  }
}
