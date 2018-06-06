import Cell from './cell'
import CellState from './cell-state'
import Simulator from './simulator'

export default class Board {
  constructor() {
    this.cells = this._initializeCells()
    this._putBlackStone(27)
    this._putBlackStone(36)
    this._putWhiteStone(28)
    this._putWhiteStone(35)
  }

  getSimpleCells() {
    return this.cells.map((cell) => cell.state)
  }

  getCells() {
    return this.cells
  }

  onUpdate(fn) {
    this.updateBoardHandler = fn
  }

  putStone(index, stone) {
    Simulator
      .flipStones(this.getSimpleCells(), index, stone)
      .forEach((cellState, index) => {
        const cell = this.cells[index]
        cell.updateState(cellState)
      })
  }

  _putWhiteStone(index) {
    this._updateBoard(index, CellState.WHITE)
  }

  _putBlackStone(index) {
    this._updateBoard(index, CellState.BLACK)
  }

  _initializeCells() {
    return [...Array(64)].map(() => new Cell())
  }

  _updateBoard(index, newCellState) {
    let cell = this.cells[index]
    cell.updateState(newCellState)
  }
}
