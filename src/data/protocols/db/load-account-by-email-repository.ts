import { type AccountModel } from '../../../domain/models'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel | undefined>
}
