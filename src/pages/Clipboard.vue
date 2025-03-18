<template>
  <div class="Clipboard">
    <button @click="handlerText">复制</button>
    <div ref="testText">测试复制</div>
    <input type="text" v-model="copyText" />
  </div>
</template>

<script setup>
import { useClipboard } from "@/hooks/useClipboard.ts";
import { ref } from "vue";

const { copy } = useClipboard();

const copyText = ref();

const testText = ref();

const handlerText = () => {
  const copyValue = testText.value.innerText;
  copy(copyValue);
};
</script>

<style lang="less"></style>
