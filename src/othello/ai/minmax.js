import AI from './ai'
import Simulator from '../simulator'
import CellState from '../cell-state'

export default class MinMax extends AI {
  get SEARCH_DEPTH() {
    return 4
  }

  choiceNextPosition() {
    const availablePositions = Simulator.getAvailablePositions(this.cells, this.player)

    let maxScore = Number.NEGATIVE_INFINITY
    let nextPosition = -1
    let scoreLogs = []
    for(let position of availablePositions) {
      const score = this.scoreNextPosition(this.cells, this.player, this.player, position, this.SEARCH_DEPTH - 1)
      scoreLogs.push(score)
      if(score > maxScore) {
        maxScore = score
        nextPosition = position
      }
    }

    if(nextPosition === -1) {
      console.log(availablePositions)
      console.log(scoreLogs)
      alert('置く場所がが見つからない')
      throw new Error('置く場所が見つかりませんでした')
    }

    return nextPosition
  }

  /**
   * 盤面における打ち手の得点を計算する
   */
  scoreNextPosition(cells, player, stoneColor, nextPosition, depth = 0) {
    const nextCells = Simulator.flipStones(cells, nextPosition, stoneColor)

    if(depth === 0) {
      return this._evaluate(nextCells, player)
    } else {
      const nextStoneColor = (stoneColor === CellState.WHITE) ? CellState.BLACK : CellState.WHITE
      const availablePositions = Simulator.getAvailablePositions(nextCells, nextStoneColor)

      // 打つ場所が無い時は探索を打ち切り盤面の評価得点を返す
      if(availablePositions.length === 0) {
        return this._evaluate(nextCells, player)
      }

      if(player === nextStoneColor) {
        let maxScore = Number.NEGATIVE_INFINITY
        for(let position of availablePositions) {
          const score = this.scoreNextPosition(nextCells, player, nextStoneColor, position, depth - 1)
          maxScore = (score > maxScore) ? score : maxScore
        }
        return maxScore
      } else {
        let minScore = Number.POSITIVE_INFINITY
        for(let position of availablePositions) {
          const score = this.scoreNextPosition(nextCells, player, nextStoneColor, position, depth - 1)
          minScore = (score < minScore) ? score : minScore
        }
        return minScore
      }
    }
  }

  _evaluate(cells, stoneColor) {
    let score = 0

    if(cells.filter((cell) => cell === CellState.EMPTY).length > 32) {
      // 中盤までは石の数を少なく取るようにする
      // 相手の石が多い方が得点が高い
      score += cells.filter((cell) => cell !== stoneColor).length
    } else {
      // 後半はたくさん石を取れるようにする
      score += cells.filter((cell) => cell === stoneColor).length
    }

    // 自分の石が角にある
    score += (cells[0] === stoneColor) ? 200 : 0
    score += (cells[7] === stoneColor) ? 200 : 0
    score += (cells[56] === stoneColor) ? 200 : 0
    score += (cells[63] === stoneColor) ? 200 : 0

    // 相手の石が角にある
    score += (cells[0] !== stoneColor) ? -200 : 0
    score += (cells[7] !== stoneColor) ? -200 : 0
    score += (cells[56] !== stoneColor) ? -200 : 0
    score += (cells[63] !== stoneColor) ? -200 : 0

    // 角の上下に石がある
    score += (cells[1] === stoneColor) ? -30 : 0
    score += (cells[6] === stoneColor) ? -30 : 0
    score += (cells[8] === stoneColor) ? -30 : 0
    score += (cells[15] === stoneColor) ? -30 : 0
    score += (cells[48] === stoneColor) ? -30 : 0
    score += (cells[55] === stoneColor) ? -30 : 0
    score += (cells[57] === stoneColor) ? -30 : 0
    score += (cells[62] === stoneColor) ? -30 : 0

    // 自分の石が角の斜めにある
    score += (cells[9] === stoneColor) ? -100 : 0
    score += (cells[14] === stoneColor) ? -100 : 0
    score += (cells[49] === stoneColor) ? -100 : 0
    score += (cells[54] === stoneColor) ? -100 : 0

    // 相手の石が角の斜めにある
    score += (cells[9] !== stoneColor) ? 100 : 0
    score += (cells[14] !== stoneColor) ? 100 : 0
    score += (cells[49] !== stoneColor) ? 100 : 0
    score += (cells[54] !== stoneColor) ? 100 : 0

    return score
  }
}
