<template>
  <div class="local-storage">
    <el-button @click="getLoc">拿本地数据</el-button>
    <el-button @click="setLoc">设置本地数据</el-button>
    <el-button @click="removeLoc">清除一个key本地数据</el-button>
    <el-button @click="clearLoc">清空本地数据</el-button>
    <span>本地数据:{{ userInfo }}</span>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@/hooks/useLocalStorage.ts";
import { ref } from "vue";

defineOptions({
  name: "LocalStorage",
  inheritAttrs: false, //不继承父类样式
});

const { getItem, setItem, removeItem, clear } = useLocalStorage();

interface IuserInfo {
  name: string;
  age: Number;
  sex: string;
}

const userInfo = ref<IuserInfo>();

const getLoc = () => {
  userInfo.value = getItem("userInfo");
};
const setLoc = () => {
  setItem("userInfo", {
    name: "ceshi",
    age: 18,
    sex: "man",
  });
};
const removeLoc = () => {
  removeItem("userInfo");
};
const clearLoc = () => {
  clear();
};
</script>

<style lang="less">
.local-storage {
  width: 100%;
  height: 100%;
  button {
    margin: 10px;
  }
}
</style>
