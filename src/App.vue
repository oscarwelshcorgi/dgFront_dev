<template>
  <HeaderPage/>
  <router-view/>
  <FooterPage/>
</template>

<script>
import HeaderPage from '@/components/HeaderPage'
import FooterPage from '@/components/FooterPage'

export default {
    name: 'App',
    components: {
        HeaderPage,
        FooterPage
    },
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
