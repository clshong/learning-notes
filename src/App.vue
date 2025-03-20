<script setup lang="ts">
import CountDown from "@/pages/CountDown.vue";
import LocalStorage from "@/pages/LocalStorage.vue";
import Clipboard from "@/pages/Clipboard.vue";
import Dashboard from "@/pages/Dashboard.vue";
</script>

<template>
  <div class="app">
    <CountDown />
    <hr />
    <LocalStorage />
    <hr />
    <Clipboard />
    <hr />
    <Dashboard />
  </div>
</template>

<style scoped>
/* .app {
  height: 5000px;
} */
</style>
