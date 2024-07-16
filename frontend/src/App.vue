<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <GoogleLogin /> <!-- GoogleLogin 컴포넌트를 여기에 추가 -->
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import GoogleLogin from '@/components/GoogleLogin.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    GoogleLogin // GoogleLogin 컴포넌트를 여기에 추가
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
