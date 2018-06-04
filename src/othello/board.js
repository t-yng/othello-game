import $ from 'jquery'
import _ from 'lodash'
import Cell from './cell'
import CellState from './cell-state'

export default class Board {
  constructor() {
    this.cells = this._initializeCells()
    this._putBlackStone(4, 4)
    this._putBlackStone(5, 5)
    this._putWhiteStone(5, 4)
    this._putWhiteStone(4, 5)
  }

  static getBoardIndex(col, row) {
    return (col - 1) + (row - 1) * 8
  }

  static getBoardPosition(index) {
    const col = index % 8 + 1
    const row = Math.floor(index / 8) + 1

    return [col, row]
  }

  getCells() {
    return this.cells
  }

  onUpdateCell(fn) {
    this.updateCellHandler = fn
  }

  canPutStone(col, row, stoneColor) {
    const index = Board.getBoardIndex(col, row)
    const cell = this.cells[index]
    if (cell.state !== CellState.EMPTY) {
      return false
    }

    const willFlippedStones = this._flipStones(col, row, stoneColor, true)

    if (willFlippedStones === 0) {
      return false
    }

    return true
  }

  putStone(col, row, stone) {
    if (stone === CellState.BLACK) {
      this._putBlackStone(col, row)
    } else if (stone === CellState.WHITE) {
      this._putWhiteStone(col, row)
    }
    this._flipStones(col, row, stone)
  }

  _putWhiteStone(col, row) {
    this._updateBoard(col, row, CellState.WHITE)
  }

  _putBlackStone(col, row) {
    this._updateBoard(col, row, CellState.BLACK)
  }

  _flipStones(col, row, stoneColor, simulation = false) {
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
      return this._checkStone(p, direction, stoneColor, [])
    })

    if (simulation) {
      return flipPositions.length
    }

    flipPositions.forEach((position) => {
      const [col, row] = position
      if (stoneColor === CellState.BLACK) {
        this._putBlackStone(col, row)
      } else {
        this._putWhiteStone(col, row)
      }
    })
  }

  _isOutOfBoard(col, row) {
    return col < 0 || col > 8 || row < 0 || row > 8
  }

  _checkStone(position, direction, stoneColor, positions = []) {
    const [col, row] = [position.col, position.row]
    if (this._isOutOfBoard(col, row)) return []

    const index = Board.getBoardIndex(col, row)
    const cell = this.cells[index]
    const cellState = cell.state

    if (cellState === CellState.EMPTY) return []

    if (cellState !== stoneColor) {
      positions.push([col, row])
      const nextPostion = {
        col: col + direction.col,
        row: row + direction.row
      }
      return this._checkStone(nextPostion, direction, stoneColor, positions)
    } else {
      return positions
    }
  }

  _initializeCells() {
    return [...Array(64)].map((_) => new Cell())
  }

  _updateBoard(col, row, newCellState) {
    const index = Board.getBoardIndex(col, row)
    let cell = this.cells[index]
    cell.updateState(newCellState)
  }
}
