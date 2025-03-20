/**
 * @description 数组中没有出现的最小正整数
 * 输入【2,3,4，】返回1；输入【1,2,3,4】，返回；输入【1,2,4，5】返回3
 */

export const findMissingNumber = (arr: number[]): number => {
  arr = [...new Set(arr)].filter((num) => num > 0).sort((a, b) => a - b); // 去重、过滤负数和0、排序

  if (!arr.includes(1)) return 1; // 如果数组中没有 1，则返回 1

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] + 1 !== arr[i + 1]) {
      return arr[i] + 1; // 找到缺失的最小正整数
    }
  }

  return arr[arr.length - 1] + 1;
};

/**
 * 节流
 */

export const throttle = <T extends any[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (!timer) {
      timer = setTimeout(() => {
        func(...args);
        timer = null;
      }, wait);
    }
  };
};

/**
 * 防抖
 */

export const debounce = <T extends any[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
      timer = null; // 确保 `timer` 被清除
    }, wait);
  };

  // 提供 `cancel` 方法，允许手动取消
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
};

/**
 * 手写flat
 */

export const flat = <T>(arr: T[], depth: number = Infinity): T[] => {
  const result: T[] = [];

  const flatten = (value: any[], d: number) => {
    for (const item of value) {
      if (Array.isArray(item) && d > 0) {
        flatten(item, d - 1);
      } else {
        result.push(item as T);
      }
    }
  };

  flatten(arr, depth);
  return result;
};

/**
 * 手写deepClone
 */

export const deepClone = <T>(obj: T, map = new WeakMap()): T => {
  // 处理 null 或非对象
  if (obj === null || typeof obj !== "object") return obj;

  // 处理循环引用，避免无限递归
  if (map.has(obj)) return map.get(obj);

  // 处理 Date、RegExp 等特殊对象
  if (obj instanceof Date) return new Date(obj) as T;
  if (obj instanceof RegExp) return new RegExp(obj) as T;

  // 处理 Array
  if (Array.isArray(obj)) {
    const copy: any[] = []; // ⚠️ 关键：初始化为数组
    map.set(obj, copy); // 存入 Map 以避免循环引用
    for (const item of obj) {
      copy.push(deepClone(item, map)); // 递归拷贝
    }
    return copy as T; // ✅ 确保返回数组
  }

  // 处理普通对象
  const copy: Record<string, any> = {}; // ⚠️ 关键：初始化为对象
  map.set(obj, copy); // 存入 Map 以避免循环引用
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key], map); // 递归拷贝
    }
  }
  return copy as T;
};

/**
 * bigNumber
 */

/**
 * 辅助函数部分
 */

/**
 * 获取数字字符串的小数位数
 * @param {string} num
 * @returns {number}
 */
function getDecimalPlaces(num) {
  return num.includes(".") ? num.split(".")[1].length : 0;
}

/**
 * 获取两个数字中较大的小数位数
 * @param {string} num1
 * @param {string} num2
 * @returns {number}
 */
function getScale(num1, num2) {
  return Math.max(getDecimalPlaces(num1), getDecimalPlaces(num2));
}

/**
 * 将数字字符串转换为整数形式（字符串），去掉小数点，
 * 并根据给定 scale 补齐小数位
 * @param {string} num
 * @param {number} scale
 * @returns {string}
 */
function toInteger(num, scale) {
  const [intPart, decPart = ""] = num.split(".");
  return (intPart + decPart.padEnd(scale, "0")).replace(/^0+/, "") || "0";
}

/**
 * 将整数（BigInt）转换为带小数点的字符串，
 * 根据指定的 scale 调整位置，并确保负数格式正确
 * @param {BigInt} num
 * @param {number} scale
 * @returns {string}
 */
function toDecimal(num, scale) {
  let str = num.toString();
  const isNegative = str.startsWith("-");
  if (isNegative) {
    str = str.slice(1);
  }
  str = str.padStart(scale + 1, "0");
  const intPart = str.slice(0, -scale) || "0";
  const decPart = str.slice(-scale).replace(/0+$/, "");
  let result = decPart ? `${intPart}.${decPart}` : intPart;
  if (isNegative && result !== "0") {
    result = "-" + result;
  }
  return result;
}

/**
 * 加法：先将两个数字对齐小数位，再转成整数进行运算
 * @param {string} num1
 * @param {string} num2
 * @returns {string}
 */
function add(num1, num2) {
  const scale = getScale(num1, num2);
  const intSum =
    BigInt(toInteger(num1, scale)) + BigInt(toInteger(num2, scale));
  return toDecimal(intSum, scale);
}

/**
 * 减法：利用加法实现，即 num1 + (-num2)
 * @param {string} num1
 * @param {string} num2
 * @returns {string}
 */
function subtract(num1, num2) {
  return add(num1, "-" + num2);
}

/**
 * 乘法：去掉小数点后直接相乘，然后根据小数位数调整
 * @param {string} num1
 * @param {string} num2
 * @returns {string}
 */
function multiply(num1, num2) {
  const scale1 = getDecimalPlaces(num1);
  const scale2 = getDecimalPlaces(num2);
  const scale = scale1 + scale2;
  const intProduct =
    BigInt(num1.replace(".", "")) * BigInt(num2.replace(".", ""));
  return toDecimal(intProduct, scale);
}

/**
 * 除法：
 * 1. 将两个数转换为整数（对齐小数位）
 * 2. 分子扩大 10^(decimalPlaces) 倍，保证足够精度
 * 3. 进行整数除法，最后转换回带小数点格式
 * @param {string} num1
 * @param {string} num2
 * @param {number} decimalPlaces
 * @returns {string}
 */
function divide(num1, num2, decimalPlaces = 10) {
  if (num2 === "0") throw new Error("Division by zero");
  const scale = Math.max(getDecimalPlaces(num1), getDecimalPlaces(num2));
  const numerator = BigInt(toInteger(num1, scale));
  const denominator = BigInt(toInteger(num2, scale));
  const factor = 10n ** BigInt(decimalPlaces);
  const result = (numerator * factor) / denominator;
  return toDecimal(result, decimalPlaces);
}

/**
 * BigNumber 类
 */
export class BigNumber {
  constructor(value) {
    if (value instanceof BigNumber) {
      this.value = value.value;
    } else if (typeof value === "number") {
      // 使用 toFixed 固定精度后去除多余的 0
      this.value = value.toFixed(10).replace(/\.?0+$/, "");
    } else if (typeof value === "string") {
      if (!/^-?\d+(\.\d+)?$/.test(value)) {
        throw new Error(`Invalid number format: "${value}"`);
      }
      this.value = value;
    } else {
      throw new Error(
        `Unsupported type: ${typeof value}. Expected number, string, or BigNumber.`
      );
    }
  }

  // 加法：返回一个新的 BigNumber 实例
  plus(other) {
    const result = add(this.value, new BigNumber(other).value);
    return new BigNumber(result);
  }

  // 减法：返回一个新的 BigNumber 实例
  minus(other) {
    const result = subtract(this.value, new BigNumber(other).value);
    return new BigNumber(result);
  }

  // 乘法：返回一个新的 BigNumber 实例
  times(other) {
    const result = multiply(this.value, new BigNumber(other).value);
    return new BigNumber(result);
  }

  // 除法：返回一个新的 BigNumber 实例，decimalPlaces 指定保留的小数位数
  dividedBy(other, decimalPlaces = 10) {
    const result = divide(
      this.value,
      new BigNumber(other).value,
      decimalPlaces
    );
    return new BigNumber(result);
  }

  // 当参与隐式转换时（如 Number() 或数学运算），返回 number 类型
  valueOf() {
    return Number(this.value);
  }

  // 当使用隐式转换时，根据 hint 返回相应类型
  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return Number(this.value);
    }
    return this.value;
  }

  // toString 返回字符串表示（用于显示）
  toString() {
    return this.value;
  }
}
