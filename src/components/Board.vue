<template>
    <div class="board">
        <cell
          v-for="(cell, index) in cells"
          :key="index"
          v-bind:state="cell.state"
          @click.native="onClickCell"
        ></cell>
    </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import Cell from './cell'
import CellState from '../othello/cell-state'
import Board from '../othello/board'
import MinMax from '../othello/ai/minmax'
import MonteCarlo from '../othello/ai/monte-carlo'
import Simulator from '../othello/simulator'

const board = new Board()
let cells = board.getCells()
let player = CellState.BLACK
let isAIThinking = false

const switchPlayer = (skip = false) => {
    let isGameEnd = Simulator.isGameEnd(board.getSimpleCells())
    player = (player === CellState.BLACK) ? CellState.WHITE : CellState.BLACK
    if(Simulator.getAvailablePositions(board.getSimpleCells(), player).length === 0) {
        if(skip) {
            isGameEnd = true
        } else if(isGameEnd === false){
            window.alert('置く場所が無いのでSKIPします')
            isAIThinking = !isAIThinking
            switchPlayer(true)
        }
    }

    if(isGameEnd) {
        const cells = board.getSimpleCells()
        const blackCount = cells.filter((cell) => cell === CellState.BLACK).length
        const whiteCount = cells.filter((cell) => cell === CellState.WHITE).length

        if(blackCount > whiteCount) {
            // window.alert(`黒: ${blackCount} vs ${whiteCount} :白
            // You Win!`)
            window.alert(`黒: ${blackCount} vs ${whiteCount} :白
            MinMax Win!`)
        } else if(blackCount < whiteCount) {
            // window.alert(`黒: ${blackCount} vs ${whiteCount} :白
            // You Lose!`)
            window.alert(`黒: ${blackCount} vs ${whiteCount} :白
            MonteCarlo Win!`)
        }　else {
            window.alert(`黒: ${blackCount} vs ${whiteCount} :白
            Draw!`)
        }

        return
    }

    let ai
    if(player === CellState.BLACK) {
        ai = new MinMax(board.getSimpleCells(), player)
    } else {
        ai = new MonteCarlo(board.getSimpleCells(), player)
    }

    const position = ai.choiceNextPosition()

    if(!Simulator.canPutStone(board.getSimpleCells(), position, player)) {
        throw new Error('AIが不正な場所に石が置きました')
    }

    $(`.cell:nth-child(${position+1})`).click()
}

setTimeout(() => {
    alert('対戦スタート!')
    const ai = new MinMax(board.getSimpleCells(), player)
    const position = ai.choiceNextPosition()

    if(!Simulator.canPutStone(board.getSimpleCells(), position, player)) {
        throw new Error('AIが不正な場所に石が置きました')
    }

    $(`.cell:nth-child(${position+1})`).click()
}, 10000)

export default {
    name: 'Board',
    data: function(){
        return {
            cells
        }
    },
    components: {
        'cell': Cell
    },
    methods: {
        onClickCell: function(event) {
            const index = $('.cell').index(event.target)
            if(Simulator.canPutStone(board.getSimpleCells(), index, player)) {
                board.putStone(index, player)

                if(player === CellState.BLACK) {
                    isAIThinking = true
                }

                setTimeout(switchPlayer, 0)
            }
        }
    }
}
</script>

<style>
.board {
  border-top: 1px solid black;
  border-left: 1px solid black;
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  height: fit-content;
  width: 400px;
}
</style>
