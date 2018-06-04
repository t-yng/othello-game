<template>
  <div id="app">
    <board/>
  </div>
</template>

<script>
import Board from './components/Board'

export default {
  name: 'App',
  components: {
    board: Board
  }
}
</script>

<style>
#app {
  display: flex;
  height: 100vh;
  justify-content: center;
}
</style>
