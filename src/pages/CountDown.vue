<template>
  <div>
    <el-button @click="handleStart" :disabled="countNum > 0">
      {{ countNum > 0 ? `${countNum} 秒后重新获取` : "获取验证码" }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useCountDown } from "@/hooks/useCountDown.ts";
const { countNum, startCountDown } = useCountDown();
const handleStart = () => {
  startCountDown(60);
};
</script>

<style lang="less"></style>
