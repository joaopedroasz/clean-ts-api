import {
  type Encrypter,
  type HashCompare,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type Authentication,
  type AuthenticationModel
} from './protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return undefined

    const isValidPassword = await this.hashCompare.compare({ plainText: password, hash: account.password })
    if (!isValidPassword) return undefined

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.update({ id: account.id, token: accessToken })

    return accessToken
  }
}
