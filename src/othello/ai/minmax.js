import Simulator from '../simulator'
import CellState from '../cell-state'

export default class MinMax {
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
    const availablePositions = Simulator.getAvailablePositions(this.cells, this.player)
    const depth = 1  // 探索の深さ
    let maxScore = Number.NEGATIVE_INFINITY
    let nextPosition = -1
    for(let position of availablePositions) {
      const score = this.scoreNextPosition(this.cells, this.player, this.player, position, depth)
      if(score > maxScore) {
        maxScore = score
        nextPosition = position
      }
    }

    return nextPosition
  }

  /**
   * 盤面における打ち手の得点を計算する
   */
  scoreNextPosition(cells, player, stoneColor, nextPosition, depth = 0) {
    let copyCells = cells.concat()
    copyCells[nextPosition] = stoneColor

    if(depth === 0) {
      return this._evaluate(cells, player)
    } else {
      const nextStoneColor = (stoneColor === CellState.WHITE) ? CellState.BLACK : CellState.WHITE
      const availablePositions = Simulator.getAvailablePositions(copyCells, nextStoneColor)

      if(player === nextStoneColor) {
        let maxScore = Number.NEGATIVE_INFINITY
        for(let position of availablePositions) {
          const score = this.scoreNextPosition(cells, player, nextStoneColor, position, depth - 1)
          maxScore = (score > maxScore) ? score : maxScore
        }
        return maxScore
      } else {
        let minScore = Number.POSITIVE_INFINITY
        for(let position of availablePositions) {
          const score = this.scoreNextPosition(cells, player, nextStoneColor, position, depth - 1)
          minScore = (score < minScore) ? score : minScore
        }
        return minScore
      }
    }
  }

  _evaluate(cells, stoneColor) {
    let score = 0

    // 石の数
    score += cells.filter((cell) => cell === stoneColor).length

    // 角に石がある
    score += (cells[0] === stoneColor) ? 20 : 0
    score += (cells[7] === stoneColor) ? 20 : 0
    score += (cells[56] === stoneColor) ? 20 : 0
    score += (cells[63] === stoneColor) ? 20 : 0

    // 角の上下に石がある
    score -= (cells[1] === stoneColor) ? -5 : 0
    score -= (cells[6] === stoneColor) ? -5 : 0
    score -= (cells[8] === stoneColor) ? -5 : 0
    score -= (cells[15] === stoneColor) ? -5 : 0
    score -= (cells[48] === stoneColor) ? -5 : 0
    score -= (cells[55] === stoneColor) ? -5 : 0
    score -= (cells[57] === stoneColor) ? -5 : 0
    score -= (cells[62] === stoneColor) ? -5 : 0

    // 角の斜めに石がある
    score -= (cells[9] === stoneColor) ? -15 : 0
    score -= (cells[14] === stoneColor) ? -15 : 0
    score -= (cells[49] === stoneColor) ? -15 : 0
    score -= (cells[54] === stoneColor) ? -15 : 0

    return score
  }
}
