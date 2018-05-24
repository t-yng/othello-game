<template>
    <div class="stone" v-bind:class="stoneColorClass"></div>
</template>

<script>
import CellState from '../othello/cell-state'

export default {
    name: 'Stone',
    props: ['color'],
    computed: {
        stoneColorClass: function() {
            return {
                'stone-black': this.color === CellState.BLACK,
                'stone-white': this.color === CellState.WHITE
            }
        }
    }
}
</script>

<style>
.stone {
  border-radius: 50%;
  height: 75%;
  width: 75%;
}

.stone-black {
  background: black;
}

.stone-white {
  background: white;
}
</style>
