<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <demoChart />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import demoChart from '@/components/randomChart.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    demoChart
  }
}
</script>
