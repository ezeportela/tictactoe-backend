const MongoLib = require('../lib/mongo')

const { 
    finishGame
} = require('../lib/game')



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
        const createGameId = await this.mongoDB.create(this.collection, {
            createdAt: Date.now(),
            finished: false,
            rows: 3,
            columns: 3,
        })

        return createGameId
    }

    async playerMoves(gameId, { row, column, player }) {
        const game = await this.getGame({ gameId })
        
        game.moves = game.moves != null ? game.moves : []

        game.moves.push({
            row,
            column,
            player,
            createdAt: Date.now(),
        })

        const result = finishGame(game)

        const updatedGame = {
            ...game,
            ...result
        }

        await this.mongoDB.update(this.collection, gameId, updatedGame)

        return updatedGame
    }
}

module.exports = GameService