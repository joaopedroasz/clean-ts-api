import { type Collection, MongoClient, type Document, type ObjectId } from 'mongodb'

type DataWithMongoId<Data> = { _id: ObjectId } & Data

type DataWithId<Data> = { id: string } & Omit<Data, '_id'>

export const MongoHelper = {
  client: undefined as unknown as MongoClient | undefined,
  uri: undefined as unknown as string | undefined,
  connect: async (uri: string): Promise<void> => {
    MongoHelper.client = await MongoClient.connect(uri)
    MongoHelper.uri = uri
  },
  disconnect: async (): Promise<void> => {
    await MongoHelper.client?.close()
    MongoHelper.client = undefined
  },
  getCollection: async <CollectionType extends Document>(name: string): Promise<Collection<CollectionType>> => {
    if (!MongoHelper.client) MongoHelper.client = await MongoClient.connect(MongoHelper.uri as string)
    return MongoHelper.client.db().collection(name)
  },
  removeMongoId: <T>(collection: DataWithMongoId<T>): DataWithId<T> => {
    const { _id, ...collectionWithoutId } = collection
    return { ...collectionWithoutId, id: _id.toHexString() }
  },
  removeManyMongoIds: <T>(collections: Array<DataWithMongoId<T>>): Array<DataWithId<T>> => {
    return collections.map(collection => MongoHelper.removeMongoId(collection))
  }
}
