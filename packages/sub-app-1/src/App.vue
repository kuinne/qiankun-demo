<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div class="sub-app">
    <h2>这是子应用1</h2>
    <div class="logo-container">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="子应用1 - Vite + Vue" />
  </div>
</template>

<style scoped>
.sub-app {
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
