export default class AI {
  constructor(cells, player) {
    this.cells = cells.concat()
    this.player = player
  }

  set cells(cells) {
    this._cells = cells
  }

  get cells() {
    return this._cells.concat()
  }

  choiceNextPosition() {
    throw new Error('choiceNextPosition()メソッドが未実装です。このメソッドの実装は必須です。')
  }

}