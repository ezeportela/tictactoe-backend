const MongoLib = require('../lib/mongo')

const { 
    checksNullArray,
    minValueOfArray,
    maxValueOfArray 
} = require('../utils')

const checkGame = (moves, total, attr, player) => {
    let result = false
    for(let i = 0; i < total; i++) {
        const index = i + 1
        
        const arr = moves.filter(item => item[attr] == index)
        result = arr.length === total && arr.every(item => item.player == player)

        if(result) return result
    }
    return result
}

const finishGame = game => {
    const { moves } = game

    for(let j = 0; j < maxValueOfArray(moves, 'player'); j++) {
        const player = j + 1

        for(let attr of [{ value: 'row', total: game.rows }, { value: 'column', total: game.columns }]) {
            const result = checkGame(game.moves, attr.total, attr.value, player)

            if(result) {
                return {
                    finished: true,
                    winner: player
                }
            }
        }
    }

    return {
        finished: false,
    }
}

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