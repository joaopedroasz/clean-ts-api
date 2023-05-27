import { MongoHelper as sut } from './mongo'

describe('MongoHelper', () => {
  const MONGO_URL = process.env.MONGO_URL ?? ''

  beforeAll(async () => {
    await sut.connect(MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('should reconnect if mongodb is down', async () => {
    let collection = await sut.getCollection('any_collection')
    expect(collection).toBeTruthy()

    await sut.disconnect()

    collection = await sut.getCollection('any_collection')
    expect(collection).toBeTruthy()
  })
})
