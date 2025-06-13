<template>
  <div class="about">
    <h2>子应用1 - 关于</h2>
    <p>这是子应用1的关于页面</p>
    <input type="text" v-model="inputValue" />
    <button @click="navigateTo">跳转到子应用2</button>
  </div>
</template>

<script setup lang="ts">
import { useMainAppActions } from "common";
import { ref } from "vue";

const { mainAppActions } = useMainAppActions();

const inputValue = ref("");

const navigateTo = () => {
  mainAppActions.navigateToByMainApp("/sub-app/sub-app-2/about");
};
</script>

<style scoped>
.about {
  padding: 20px;
  text-align: center;
}
</style>
