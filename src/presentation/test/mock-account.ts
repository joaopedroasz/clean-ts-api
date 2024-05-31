import type { AuthenticationModel, AccountModel } from '@/domain/models'
import type { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken, LoadAccountByTokenParams } from '@/domain/use-cases'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    public async auth (authentication: AuthenticationParams): Promise<AuthenticationModel | undefined> {
      return mockAuthenticationModel()
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (data: LoadAccountByTokenParams): Promise<AccountModel | undefined> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
