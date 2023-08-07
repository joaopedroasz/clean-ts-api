import { type AccountModel } from '@/domain/models'

export interface LoadAccountByTokenInput {
  token: string
  role?: string
}

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenInput) => Promise<AccountModel | undefined>
}
