import type { AddAccount, Authentication, LoadAccountByToken } from '@/domain/use-cases'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    public async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return mockAuthenticationModel()
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (data: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result > {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
