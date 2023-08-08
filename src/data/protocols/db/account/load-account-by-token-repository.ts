import { type AccountModel } from '@/domain/models'

export type LoadAccountByTokenInput = {
  token: string
  role?: string
}

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenInput) => Promise<AccountModel | undefined>
}
