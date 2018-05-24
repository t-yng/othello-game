<template>
    <div class="board">
        <cell
          v-for="(cell, index) in cells"
          :key="index"
          v-bind:state="cell"
          @click.native="onClickCell"
        ></cell>
    </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import Cell from './Cell'
import CellState from '../othello/cell-state'
import Board from '../othello/Board'

const board = new Board()
let cells = board.getCells()
let player = CellState.BLACK

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
            const [col, row] = Board.getBoardPosition(index)
            if(board.canPutStone(col, row, player)) {
                board.putStone(col, row, player)
                player = (player === CellState.BLACK) ? CellState.WHITE : CellState.BLACK
            }
        }
    }
}
</script>

<style>
.board {
  width: 400px;
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  border-top: 1px solid black;
  border-left: 1px solid black;
}
</style>
