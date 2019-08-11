const { MongoClient, ObjectId } = require('mongodb')
const { config } = require('../config')

const { dbUser, dbPassword, dbHost, dbPort, dbName } = config

const user = encodeURIComponent(dbUser)
const password = encodeURIComponent(dbPassword)

const MONGO_URI = `mongodb://${user}:${password}@${dbHost}:${dbPort}/?authSource=${dbName}`

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true })
    this.dbName = dbName
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(error => {
        if (error) {
          reject(error)
        }

        resolve(this.client.db(this.dbName))
      })
    })
  }

  async getAll(collection, query) {
    const db = await this.connect()
      return db.collection(collection)
          .find(query)
          .toArray()
  }

  async get(collection, id) {
    const db = await this.connect()
      return db.collection(collection)
          .findOne({ _id: ObjectId(id) })
  }

  async create(collection, data) {
    const db = await this.connect()
      const result_1 = db.collection(collection).insertOne(data)
      return result_1.insertedId
  }

  async update(collection, id, data) {
    const db = await this.connect()
      const result_1 = db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      return result_1.upsertedId || id
  }

  async delete(collection, id) {
    const db = await this.connect()
      db.collection(collection).deleteOne({ _id: ObjectId(id) })
      return id
  }
}

module.exports = MongoLib