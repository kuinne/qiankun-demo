<template>
  <div class="home">
    <h2>子应用1 - 首页</h2>
    <p>这是子应用1的首页内容</p>
    <div class="card">
      <h3>Element Plus 弹窗示例</h3>
      <DialogExample />
    </div>
  </div>
</template>

<script setup lang="ts">
import DialogExample from '../components/DialogExample.vue'
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.card {
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
