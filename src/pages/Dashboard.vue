<template>
  <div class="dashboard-container">
    <div class="box-1">
      测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
    </div>
    <div class="box-2">
      测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试
    </div>
    <el-button type="primary" @click="handlerDebounce">测试防抖</el-button>
    <hr />

    <textarea class="textarea" v-model="text"></textarea>

    <div class="editable" contenteditable="true">请输入文本...</div>
  </div>
</template>

<script setup lang="ts">
import {
  findMissingNumber,
  throttle,
  debounce,
  BigNumber,
  flat,
  deepClone,
} from "@/utils/index.ts"
import { ref } from "vue"
import _ from "lodash"
console.log(findMissingNumber([2, 3, 4])) // 输出 1
console.log(findMissingNumber([1, 2, 3, 4])) // 输出 5
console.log(findMissingNumber([1, 2, 4])) // 输出 3
console.log(findMissingNumber([7, 9, 10]))

const log = throttle(() => console.log("执行了！"), 2000)
window.addEventListener("scroll", log)

const handlerDebounce = debounce(() => {
  console.log("执行了！")
}, 2000)

const a = new BigNumber("0.1")
const b = new BigNumber("0.2")

console.log("a + b =", a.plus(b).valueOf()) // 0.3  -> 数字
console.log("a - b =", a.minus(b).valueOf()) // -0.1 -> 数字
console.log("a * b =", a.times(b).valueOf()) // 0.02 -> 数字
console.log("a / b =", a.dividedBy(b).valueOf()) // 0.5  -> 数字

let arr = [1, 2, [3, [4, [5, 6]]]]
console.log(flat(arr, 1))
console.log(flat(arr, 3))

const text = ref()

const arr1 = ref([1, 2, 3])
const arr2 = deepClone(arr1)
const arr3 = _.cloneDeep(arr1)
console.log(
  arr1.value,
  arr2._value,
  arr3.value,
  arr1.value == arr2._value,
  arr1.value == arr3.value
)
</script>

<style lang="less">
.dashboard-container {
  //   width: 100%;
  //   height: 100%;
}
.box-1,
.box-2 {
  width: 100px;
  height: 100px;
}
.box-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center; /* 可选，如果要水平居中 */
  //   height: 100vh; /* 示例：让父容器占满屏幕 */
  border: 1px solid #ccc;
}

.textarea {
  height: 100px;
  line-height: 100px; /* 让文本高度与 textarea 相同 */
  text-align: center; /* 水平居中 */
  vertical-align: middle;
}
.editable {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 300px;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>
