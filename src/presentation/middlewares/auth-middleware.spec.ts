import { forbidden } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { type AccountModel } from '../../domain/models'
import { type LoadAccountByTokenModel, type LoadAccountByToken } from '../../domain/use-cases'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'hashed_password'
})

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token existes in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (data: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
        return makeFakeAccount()
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({
      headers: {}
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (data: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
        return makeFakeAccount()
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
