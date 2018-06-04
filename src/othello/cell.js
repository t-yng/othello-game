import CellState from './cell-state'

class Cell {
  constructor() {
    this.state = CellState.EMPTY
  }

  get state() {
    return this._state
  }

  set state(state) {
    if(!Object.values(CellState).includes(state)) {
      throw new Error(`不適切な値をセルの状態としてセットしようとしています。: ${state}`)
    }
    this._state = state
  }

  updateState(state) {
    this.state = state
  }
}

export default Cell