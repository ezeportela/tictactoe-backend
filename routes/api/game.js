const express = require('express')
const GameService = require('../../services/game')


const gameService = new GameService()

const gameApi = app => {
	const router = express.Router()
	app.use('/api/games', router)

	router.get('/', async (req, res, next) => {
	    try {
	        const games = await gameService.getGames()

	        res.status(200).json({
                data: games,
                message: 'games listed'
	        })
	    } catch(err) {
	        next(err)
	    }
	})

	router.get('/:gameId', async (req, res, next) => {
	    const { gameId } = req.params

	    try {
	        const game = await gameService.getGame({ gameId })

	        res.status(200).json({
	            data: game,
	            message: 'game retrieved'
	        })
	    } catch(err) {
	        next(err)
	    }
	})

	router.post('/', async (req, res, next) => {
	    try {
	        const createdGame = await gameService.createGame()

	        res.status(201).json({
	            data: createdGame,
	            message: 'game created'
	        })
	    } catch(err) {
	        next(err)
	    }
    })
    
    router.post('/:gameId', async (req, res, next) => {
	    const { gameId } = req.params
        const { body: game } = req

	    try {
	        const updatedGame = await gameService.playerMoves(gameId, game)

	        res.status(200).json({
	            data: updatedGame,
	            message: 'game updated'
	        })
	    } catch(err) {
	        next(err)
	    }
	})
}

module.exports = gameApi