const MongoLib = require('../lib/mongo')

const { checksNullArray } = require('../utils')

class GameService {
    constructor() {
        this.collection = 'games'
        this.mongoDB = new MongoLib()
    }

    async getGames() {
        const games = await this.mongoDB.getAll(this.collection, {})
        return Promise.resolve(games || [])
    }

    async getGame({ gameId }) {
        const game = await this.mongoDB.get(this.collection, gameId)
        return game || {}
    }

    async createGame() {
        const createScriptId = await this.mongoDB.create(this.collection, {
            createdAt: Date.now(),
            finished: false
        })

        return createScriptId
    }

    async playerMoves(gameId, { row, column, player }) {
        const game = await this.getGame({ gameId })
        
        game.moves = checksNullArray ? [] : game.moves
        game.moves.push({
            row,
            column,
            player
        })

        const updatedGame = await this.mongoDB.update(this.collection, gameId, game)

        return game
    }
}

module.exports = GameService