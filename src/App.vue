<template>
  <div id="app">
    <!--<img alt="Vue logo" height="100" src="./assets/logo.png">-->
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  color: #2c3e50;
  background-color: #f4f6f9;
  min-height: 100vh;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
