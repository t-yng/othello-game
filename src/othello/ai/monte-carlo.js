import _ from 'lodash'
import AI from './ai'
import Simulator from '../simulator'
import CellState from '../cell-state'

export default class MonteCarlo extends AI {
  get SEARCH_DEPTH() {
    return 2
  }

  get PLAYOUT_TIMES() {
    return 50
  }

  choiceNextPosition() {
    const availablePositions = Simulator.getAvailablePositions(this.cells, this.player)

    let maxWinningRate = Number.NEGATIVE_INFINITY
    let nextPosition = -1
    for(let position of availablePositions) {
      const winningRate = this.computeWinningRate(this.cells, this.player, this.player, position, this.SEARCH_DEPTH - 1)
      if(winningRate > maxWinningRate) {
        maxWinningRate = winningRate
        nextPosition = position
      }
    }

    return nextPosition
  }

  computeWinningRate(cells, player, stoneColor, nextPosition, depth = 0) {
    const nextCells = Simulator.flipStones(cells, nextPosition, stoneColor)
    const nextStoneColor = (stoneColor === CellState.WHITE) ? CellState.BLACK : CellState.WHITE

    if(depth <= 0) {
      return this.repeatPlayOut(nextCells, player, nextStoneColor, this.PLAYOUT_TIMES)
    } else {
      const availablePositions = Simulator.getAvailablePositions(nextCells, nextStoneColor)

      // 打つ場所が無い時は探索を打ち切り盤面の評価得点を返す
      if(availablePositions.length === 0) {
        return this.repeatPlayOut(nextCells, player, nextStoneColor, this.PLAYOUT_TIMES)
      }

      if(player === nextStoneColor) {
        let maxWinningRate = Number.NEGATIVE_INFINITY
        for(let position of availablePositions) {
          const winningRate = this.computeWinningRate(nextCells, player, nextStoneColor, position, depth - 1)
          maxWinningRate = (winningRate > maxWinningRate) ? winningRate : maxWinningRate
        }
        return maxWinningRate
      } else {
        let minWinningRate = Number.POSITIVE_INFINITY
        for(let position of availablePositions) {
          const winningRate = this.computeWinningRate(nextCells, player, nextStoneColor, position, depth - 1)
          minWinningRate = (winningRate < minWinningRate) ? winningRate : minWinningRate
        }
        return minWinningRate
      }
    }
  }

  /**
   * プレイアウトを一定数だけ繰り返して勝率を返す
   *
   * @param {*} cells
   * @param {*} player
   * @param {*} stoneColor
   * @param {*} times
   */
  repeatPlayOut(cells, player, stoneColor, times = this.PLAYOUT_TIMES) {
    const winCount = [...Array(times)]
      .map(() => this.playOut(cells, stoneColor))
      .filter((winner) => winner === player)
      .length

    return winCount / times
  }

  playOut(cells, stoneColor) {
    let nextCells = cells.concat()
    let skipCount = 0

    while(skipCount < 2 && Simulator.isGameEnd(nextCells) === false) {
      // 置く場所をランダムに選択
      const availablePositions = Simulator.getAvailablePositions(nextCells, stoneColor)

      if(availablePositions.length === 0) {
        skipCount++
        continue
      }

      const position = _
        .chain(availablePositions)
        .shuffle()
        .head()
        .value()

      nextCells = Simulator.flipStones(nextCells, position, stoneColor)
      stoneColor = (stoneColor === CellState.BLACK) ? CellState.WHITE : CellState.BLACK
    }

    return this.judgeWinner(nextCells)

    // if(Simulator.isGameEnd(cells)) {
    //   return this.judgeWinner(cells)
    // }

    // // 置く場所をランダムに選択
    // const availablePositions = Simulator.getAvailablePositions(this.cells, stoneColor)
    // const nextStoneColor = (stoneColor === CellState.BLACK) ? CellState.WHITE : CellState.BLACK

    // if(availablePositions.length === 0) {
    //   if(beforeSkip) {
    //     return this.judgeWinner(cells)
    //   }
    //   return this.playOut(cells, nextStoneColor, true)
    // }

    // const position = _
    //   .chain(availablePositions)
    //   .shuffle()
    //   .head()
    //   .value()
    // const nextCells = Simulator.flipStones(cells, position, stoneColor)

    // return this.playOut(nextCells, nextStoneColor)
  }

  judgeWinner(cells) {
    const blackCount = cells.filter((cell) => cell === CellState.BLACK).length
    const whiteCount = cells.filter((cell) => cell === CellState.WHITE).length

    return (blackCount > whiteCount) ? CellState.BLACK : CellState.WHITE
  }
}