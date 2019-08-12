const { maxValueOfArray, randomValue } = require('../utils')

const checkSquare = (moves, total, attr, player) => {
    let result = false
    for(let i = 0; i < total; i++) {
        const index = i + 1
        
        const arr = moves.filter(item => item[attr] == index)
        result = arr.length === total && arr.every(item => item.player == player)

        if(result) return result
    }
    return result
}

const intersectMoves = (arr1, arr2) => arr1.filter( item1 => arr2.some(item2 => item1.row === item2.row && item1.column === item2.column && item1.player === item2.player ) )

const checkDiagonals = (moves, columns, player) => {
    const arrMoves = moves
        .filter(item => item.player == player)
        .map(({ row, column, player}) => { return { row, column, player } })

    const diagonals = []

    for(let i = 0; i < columns; i++) {
        diagonals.push({
            row: i + 1,
            column: i + 1,
            player,
        })
    }
    
    let intersection = intersectMoves(arrMoves, diagonals)

    if(intersection.length == columns) return true

    const reverseDiagonals = []

    for(let i = 0; i < columns; i++) {
        reverseDiagonals.push({
            row: i + 1,
            column: columns - i,
            player,
        })
    }

    intersection = intersectMoves(arrMoves, reverseDiagonals)
    
    if(intersection.length == columns) return true

    return false
}

const finishGame = game => {
    const { moves } = game

    for(let j = 0; j < maxValueOfArray(moves, 'player'); j++) {
        const player = j + 1

        for(let attr of [{ value: 'row', total: game.rows }, { value: 'column', total: game.columns }]) {
            const result = checkSquare(game.moves, attr.total, attr.value, player)

            if(result) {
                return {
                    finished: true,
                    winner: player
                }
            }
        }

        if(checkDiagonals(moves, game.columns, player)) {
            return {
                finished: true,
                winner: player
            }
        }
    }

    return {
        finished: false,
    }
}

const computerMoves = ({ moves, rows, columns }) => {
    const computerPlayer = 2
    const allMoves = []

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            allMoves.push({
                row: i + 1,
                column: j + 1
            })
        }
    }

    const arrMoves = moves
        .map(({ row, column }) => { return { row, column } })

    const difference = allMoves
        .filter(item => !arrMoves
                            .map(item2 => `${item2.row}${item2.column}`)
                            .includes(`${item.row}${item.column}`))

    /*let arrRows = []
    let arrColumns = []

    for(let i = 0; i < rows; i++) {
        arrRows.push({
            row: i + 1,
            blank: difference.filter(item => item.row === i + 1).length,
            filled: moves.filter(item => item.row === i + 1 && player === computerPlayer).length
        })

        arrColumns.push({
            column: i + 1,
            blank: difference.filter(item => item.column === i + 1).length,
            filled: moves.filter(item => item.column === i + 1 && player === computerPlayer).length
        })
    }*/

    const move = difference[randomValue(difference.length)]
    return move
}

module.exports = {
    finishGame,
    computerMoves
}