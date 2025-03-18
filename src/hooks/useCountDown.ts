/**
 * @description 验证码读秒功能
 */
import { ref, onUnmounted } from "vue";

export function useCountDown() {
  const countNum = ref<number>(0);
  let countInterVal: ReturnType<typeof setInterval> | null = null;

  /**
   * 开始倒计时
   * @param num 倒计时时间（秒）
   */
  const startCountDown = (num: number) => {
    countNum.value = num;
    clearCountDown();
    countInterVal = setInterval(() => {
      if (countNum.value <= 0) {
        clearCountDown();
        return;
      }
      countNum.value--;
    }, 1000);
  };

  /**
   * 清除倒计时
   */
  const clearCountDown = () => {
    if (countInterVal) {
      clearInterval(countInterVal);
      countInterVal = null;
    }
  };

  // 组件卸载时清除定时器，防止内存泄漏
  onUnmounted(() => {
    clearCountDown();
  });

  return {
    countNum,
    startCountDown,
    clearCountDown,
  };
}
