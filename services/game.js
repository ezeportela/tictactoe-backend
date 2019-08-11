const MongoLib = require('../lib/mongo')

class GameService {
    constructor() {
        this.collection = 'games'
        this.mongoDB = new MongoLib()
    }

    async getGames() {
        const games = await this.mongoDB.getAll(this.collection, query)
        return Promise.resolve(scripts || [])
    }

    async getGame({ gameId }) {
        const game = await this.mongoDB.get(this.collection, gameId)
        return game || []
    }

    async createGame() {
        const createScriptId = await this.mongoDB.create(this.collection, {
            createdAt: Date.now(),
            finished: false
        })

        return createScriptId
    }
}

module.exports = GameService