import { type Collection, MongoClient, type Document, type ObjectId } from 'mongodb'

type DataWithMongoId<Data> = { _id: ObjectId } & Data

type DataWithId<Data> = { id: string } & Omit<Data, '_id'>

export const MongoHelper = {
  client: undefined as unknown as MongoClient | undefined,
  connect: async (uri: string): Promise<void> => {
    MongoHelper.client = await MongoClient.connect(uri)
  },
  disconnect: async (): Promise<void> => {
    await MongoHelper.client?.close()
  },
  getCollection: <CollectionType extends Document>(name: string): Collection<CollectionType> => {
    if (!MongoHelper.client) {
      throw new Error('MongoDB not connected')
    }
    return MongoHelper.client.db().collection(name)
  },
  removeMongoId: <T>(collection: DataWithMongoId<T>): DataWithId<T> => {
    const { _id, ...collectionWithoutId } = collection
    return { ...collectionWithoutId, id: _id.toHexString() }
  }
}
