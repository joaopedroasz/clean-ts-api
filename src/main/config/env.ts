export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-mongodb',
  SERVER_PORT: process.env.SERVER_PORT ?? 3000
}
