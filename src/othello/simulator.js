import _ from 'lodash'
import CellState from './cell-state'

const LEFT_UP = -9
const UP = -8
const RIGHT_UP = -7
const LEFT = -1
const RIGHT = 1
const LEFT_DOWN = 7
const DOWN = 8
const RIGHT_DOWN = 9

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

  static isGameEnd(cells) {
    return cells.includes(CellState.EMPTY) === false
  }

  static flipStones(cells, index, stoneColor, count = false) {
    let copyCells = cells.concat()
    copyCells[index] = stoneColor

    // 石を反転させる方向
    let directions = [
      LEFT_UP,
      UP,
      RIGHT_UP,
      LEFT,
      RIGHT,
      LEFT_DOWN,
      DOWN,
      RIGHT_DOWN
    ]

    const flipPositions = _.flatMap(directions, (direction) => {
      return this._getFlipStonePositions(cells, index, direction, stoneColor, [])
    })

    if (count) {
      return flipPositions.length
    }

    flipPositions.forEach((position) => {
      copyCells[position] = stoneColor
    })

    return copyCells
  }

  static _getFlipStonePositions(cells, position, direction, stoneColor, positions = []) {
    if (this._isOutOfBoard(position, direction)) return []

    const nextPostion = position + direction
    const cellState = cells[nextPostion]

    if (cellState === CellState.EMPTY) return []

    if (cellState !== stoneColor) {
      positions.push([nextPostion])
      return this._getFlipStonePositions(cells, nextPostion, direction, stoneColor, positions)
    } else {
      return positions
    }
  }

  static _isLeftEnd(index) {
    return index % 8 === 0
  }

  static _isRightEnd(index) {
    return index % 8 === 7
  }

  static _isOutOfBoard(index, direction) {
    let isOutOfBoard = false
    if(this._isLeftEnd(index)) {
      isOutOfBoard = isOutOfBoard || [LEFT_UP, LEFT, LEFT_DOWN].includes(direction)
    }

    if(this._isRightEnd(index)) {
      isOutOfBoard = isOutOfBoard || [RIGHT_UP, RIGHT, RIGHT_DOWN].includes(direction)
    }

    const nextPostion = index + direction
    isOutOfBoard = isOutOfBoard || nextPostion < 0 || 63 < nextPostion

    return isOutOfBoard
  }
}