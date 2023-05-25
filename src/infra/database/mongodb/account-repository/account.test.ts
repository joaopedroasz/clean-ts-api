import { MongoHelper } from '../helpers'
import { AccountMongoRepository } from './account'

describe('AccountMongoRepository', () => {
  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return on account on success', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account).toEqual({
      id: expect.any(String),
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
