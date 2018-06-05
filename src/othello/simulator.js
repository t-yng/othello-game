import _ from 'lodash'
import Board from './board'
import CellState from './cell-state'

export default class Simulator {
  static getAvailablePositions(cells, stoneColor) {
    const emptyPositions = cells
      .map((cell, index) => (cell === CellState.EMPTY) ? index : -1)
      .filter((value) => value >= 0)
    const avaliablePositions = emptyPositions.filter((index) => this.canPutStone(cells, index, stoneColor))
    return avaliablePositions
  }

  static canPutStone(cells, index, stoneColor) {
    const cell = cells[index]
    if (cell !== CellState.EMPTY) {
      return false
    }

    const willFlippedStones = this.flipStones(cells, index, stoneColor, true)

    if (willFlippedStones === 0) {
      return false
    }

    return true
  }

  static flipStones(cells, index, stoneColor, count = false) {
    let copyCells = cells.concat()
    const [col, row] = Board.getBoardPosition(index)

    // 石を反転させる
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [1, 1],
      [1, -1],
      [-1, 0],
      [-1, 1],
      [-1, -1]
    ].map((direction) => {
      return {
        col: direction[0],
        row: direction[1]
      }
    })

    const flipPositions = _.flatMap(directions, (direction) => {
      const p = { col: col + direction.col, row: row + direction.row }
      return this._getFlipStonePositions(cells, p, direction, stoneColor, [])
    })

    if (count) {
      return flipPositions.length
    }

    flipPositions.forEach((position) => {
      const [col, row] = position
      const index = Board.getBoardIndex(col, row)
      copyCells[index] = stoneColor
    })

    return copyCells
  }

  static _getFlipStonePositions(cells, position, direction, stoneColor, positions = []) {
    const [col, row] = [position.col, position.row]
    if (this._isOutOfBoard(col, row)) return []

    const index = Board.getBoardIndex(col, row)
    const cellState = cells[index]

    if (cellState === CellState.EMPTY) return []

    if (cellState !== stoneColor) {
      positions.push([col, row])
      const nextPostion = {
        col: col + direction.col,
        row: row + direction.row
      }
      return this._getFlipStonePositions(cells, nextPostion, direction, stoneColor, positions)
    } else {
      return positions
    }
  }

  static _isOutOfBoard(col, row) {
    return col <= 0 || col > 8 || row <= 0 || row > 8
  }

}