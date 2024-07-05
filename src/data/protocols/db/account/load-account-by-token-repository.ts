import { type AccountModel } from '@/domain/models'

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenRepository.Params) => Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository {
  export type Params = {
    token: string
    role?: string
  }
  export type Result = AccountModel | undefined
}
