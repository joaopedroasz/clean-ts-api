import type { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import type { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenInput, UpdateAccessTokenRepository } from '../protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return mockAccountModel()
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | undefined> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByToken = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenStub implements LoadAccountByTokenRepository {
    async loadByToken (data: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (input: UpdateAccessTokenInput): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}
