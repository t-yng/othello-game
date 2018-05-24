<template>
    <div class="cell">
        <stone v-if="state !== EMPTY" v-bind:color="state"></stone>
    </div>
</template>

<script>
import Stone from './Stone'
import CellState from '../othello/cell-state'

export default {
    name: 'Cell',
    props: ['state'],
    data: function() {
        return {
            EMPTY: CellState.EMPTY
        }
    },
    components: {
        stone: Stone
    }
}
</script>

<style>
.cell {
  align-items: center;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  background: green;
  display: flex;
  justify-content: center;
}
</style>