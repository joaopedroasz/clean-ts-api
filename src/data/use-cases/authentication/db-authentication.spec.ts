import { type AccountModel } from '../../../domain/models'
import { type LoadAccountByEmailRepository } from '../../protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return {
          id: 'any_id',
          email: 'email@mail.com',
          name: 'any_name',
          password: 'any_password'
        }
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth({
      email: 'email@mail.com',
      password: 'any_password'
    })

    expect(loadAccountSpy).toHaveBeenCalledWith('email@mail.com')
  })
})
