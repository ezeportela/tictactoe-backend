const MongoLib = require('../lib/mongo')

const { 
    finishGame,
    computerMoves
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
        const createdGame = await this.mongoDB.create(this.collection, {
            createdAt: Date.now(),
            finished: false,
            rows: 3,
            columns: 3,
        })

        return createdGame
    }

    async playerMoves(gameId, { row, column, player }) {
        const computerPlayer = 2
        const game = await this.getGame({ gameId })
        
        if(!game.finished) {
            game.moves = game.moves != null ? game.moves : []

            game.moves.push({
                row,
                column,
                player,
                createdAt: Date.now(),
            })

            let result = finishGame(game)

            if(!result.finished) {
                const computerMove = computerMoves(game)

                game.moves.push({
                    row: computerMove.row,
                    column: computerMove.column,
                    player: computerPlayer,
                    createdAt: Date.now(),
                })

                result = finishGame(game)
            }

            const updatedGame = {
                ...game,
                ...result
            }

            await this.mongoDB.update(this.collection, gameId, updatedGame)

            return updatedGame
        }

        return game
    }
}

module.exports = GameService