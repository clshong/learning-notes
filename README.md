### Learning-notes
前端学习笔记 & 踩坑日记 & 冷知识，记录一些工作中遇到的问题，长期更新

### hooks函数
- useClipboard
- useCountDown
- useLocalStorage

### isNaN() 和 Number.isNaN() 的区别

``` javascript
Number.isNaN(NaN); // true
Number.isNaN(Number.NaN); // true
Number.isNaN(0 / 0); // true

Number.isNaN({}); // false
Number.isNaN('NaN'); // false
Number.isNaN('blabla'); // false
Number.isNaN(undefined); // false

isNaN({}); // true
isNaN('NaN'); // true
isNaN('blabla'); // true
isNaN(undefined); // true
```

### CSS 实现文本溢出省略

- 单行文本

```
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行文本

```
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
```

### 复制粘贴板

```
export function useClipboard() {
  /**
   * 复制文本到剪切板
   * @param text 需要复制的文本
   * @returns 是否复制成功
   */
  const copy = async (text: string): Promise<boolean> => {
    if (!text) return false;

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error("复制失败:", error);
        return false;
      }
    }

    // 兼容不支持 Clipboard API 的情况
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const success = document.execCommand("copy");
      return success;
    } catch (error) {
      console.error("复制失败:", error);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return { copy };
}
```

### 什么是`抽象渗漏`

抽象渗漏指的是在代码中暴露了底层的实现细节，这些底层实现细节应该被屏蔽掉。

举例：在数组内查找某个值是否存在的时候，我们通常会使用到 `indexOf` 方法，该方法成功时返回下标，失败时返回 `-1`，这里用 `-1` 作为失败时的返回值，而这种细节应该被屏蔽掉。

所以更加推荐使用 `includes` 这种不会暴露代码底层实现细节的方法：

```
// 不推荐
[1, 2, 3].indexOf(1) !== -1; // true

// 推荐
[1, 2, 3].includes(1); // true
```

### 高性能向下取整

```
// 不推荐
const num = parseFloat(1.2);
const num = parseFloat('1.2');

// 推荐
const num = 1.2 >>> 0;
const num = '1.2' >>> 0;
```

### SEO 优化

- 最好用 ssr 框架，比如 react 的 next，或者 vue 的 nuxt（废话）
- HTML 标签语义化，在适当的位置使用适当的标签
- a 标签都记得设置链接，并且要加上 title 属性加以说明
- img 标签都记得加 alt 属性
- 谨慎使用 display: none，因为搜索引擎会过滤掉 display: none 中的内容
- meta 信息包含 title、keywords、description，有的页面需要单独定制，有的需要通用
- 页面在 html 标签上加 lang="zh-CN"属性，表明文档的语言
- 每个页面最好都要有且仅有一个 h1 标题，尤其是不需要登录的页面（若不喜欢 h1 的默认样式可通过 CSS 设置）

### 整天挂在嘴边的闭包到底是什么？

这里收集了不同文献中的原话，具体怎么理解看你自己：

- **《JavaScript 高级程序设计》**

  闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。

- **《Node 深入浅出》**

  在 JavaScript 中，实现外部作用域访问内部作用域中变量的方法叫做闭包（closure）。

- **《JavaScript 设计模式与开发实践》**

  局部变量所在的环境被外界访问，这个局部变量就有了不被销毁的理由。这时就产生了一个闭包结构，在闭包中，局部变量的生命被延续了。

- **《你不知道的 JavaScript（上卷）》**

  内部的函数持有对一个值的引用，引擎会调用这个函数，而词法作用域在这个过程中保持完整，这就是闭包。换句话说：当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域外执行，这时就产生了闭包。

### 节流与防抖

- 节流

```
const throttle = <T extends any[]>(
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
```

- 防抖

```
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
```

### 判断一个对象是普通对象还是通过类创建的

```
const isPlainObject = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
};
```

### 判断是否在浏览器环境

```
const isBrowser = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
};
```

### 判断是否为移动端

```
const userAgent = () => {
  const u = navigator.userAgent;
  return {
    trident: u.includes('Trident'),
    presto: u.includes('Presto'),
    webKit: u.includes('AppleWebKit'),
    gecko: u.includes('Gecko') && !u.includes('KHTML'),
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.includes('Android') || u.includes('Adr'),
    iPhone: u.includes('iPhone'),
    iPad: u.includes('iPad'),
    webApp: !u.includes('Safari'),
    weixin: u.includes('MicroMessenger'),
    qq: !!u.match(/\sQQ/i),
  };
};

const isMobile = () => {
  if (!isBrowser()) {
    return false;
  }
  const { mobile, android, ios } = userAgent();
  return mobile || android || ios || document.body.clientWidth < 750;
};
```

### 实现一个 compose 函数

> 原理：函数依次从右向左执行
>
> 场景：对输入值进行一系列转换 避免嵌套

```javascript
export const compose = <T, R>(...funcs: Array<(arg: any) => any>) => {
  return (initialValue: T): R =>
    funcs.reduceRight((acc, fn) => fn(acc), initialValue);
};
```

### 处理数字精度问题

工具 bignumber.js 业务中使用现成的库

`BigNumber` 类实现

```
class BigNumber {
  private value: string;

  constructor(value: number | string) {
    if (typeof value === 'number') {
      this.value = value.toString();
    } else if (typeof value === 'string') {
      if (!/^-?\d+(\.\d+)?$/.test(value)) {
        throw new Error('Invalid number format');
      }
      this.value = value;
    } else {
      throw new Error('Unsupported type');
    }
  }

  // **加法**
  plus(other: BigNumber | number | string): BigNumber {
    const num1 = this.value;
    const num2 = new BigNumber(other).value;
    return new BigNumber(add(num1, num2));
  }

  // **减法**
  minus(other: BigNumber | number | string): BigNumber {
    const num1 = this.value;
    const num2 = new BigNumber(other).value;
    return new BigNumber(subtract(num1, num2));
  }

  // **乘法**
  times(other: BigNumber | number | string): BigNumber {
    const num1 = this.value;
    const num2 = new BigNumber(other).value;
    return new BigNumber(multiply(num1, num2));
  }

  // **除法**
  dividedBy(other: BigNumber | number | string, decimalPlaces = 10): BigNumber {
    const num1 = this.value;
    const num2 = new BigNumber(other).value;
    return new BigNumber(divide(num1, num2, decimalPlaces));
  }

  // **转字符串**
  toString(): string {
    return this.value;
  }
}
```

```
const add = (num1: string, num2: string): string => {
  let [int1, dec1] = num1.split('.');
  let [int2, dec2] = num2.split('.');
  
  dec1 = dec1 || '0';
  dec2 = dec2 || '0';
  
  const maxDecLength = Math.max(dec1.length, dec2.length);
  dec1 = dec1.padEnd(maxDecLength, '0');
  dec2 = dec2.padEnd(maxDecLength, '0');

  const intSum = BigInt(int1) + BigInt(int2);
  const decSum = BigInt(dec1) + BigInt(dec2);

  const decStr = decSum.toString().padStart(maxDecLength, '0');
  return `${intSum}.${decStr}`.replace(/\.?0+$/, '');
};

const subtract = (num1: string, num2: string): string => {
  return add(num1, `-${num2}`);
};

const multiply = (num1: string, num2: string): string => {
  const factor = 10 ** (num1.split('.')[1]?.length || 0 + num2.split('.')[1]?.length || 0);
  return (BigInt(num1.replace('.', '')) * BigInt(num2.replace('.', '')) / BigInt(factor)).toString();
};
const divide = (num1: string, num2: string, decimalPlaces = 10): string => {
  const factor = BigInt(10 ** decimalPlaces);
  return (BigInt(num1.replace('.', '')) * factor / BigInt(num2.replace('.', ''))).toString();
};

```

### 垂直居中 textarea

```
<textarea class="textarea"></textarea>

.textarea {
  height: 100px;
  line-height: 100px; /* 让文本高度与 textarea 相同 */
  text-align: center; /* 水平居中 */
  vertical-align: middle;
}
```

### interface 和 type 的区别

### 相同点：

- 都可以描述对象
- 都允许扩展（extends）

### 不同点：

- type 可以为任何类型引入名称，interface 只能描述对象
- type 不支持继承，只能通过交叉类型合并，interface 可以通过继承扩展，也可以通过重载扩展
- type 无法被实现 implements，而接口可以被派生类实现
- type 重名会抛出错误，interface 重名会产生合并
- interface 性能比 type 好一点（社区有讨论过这点，争议比较大，不管对不对，我贴出来兄弟们自己判断吧）

### 手写 Array.flat(Infinity)

```
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
```

### 图片加载失败处理方式

```
<img src={imgSrc || defaultSrc} />
```

图片加载失败，使用图片自带的 error 事件处理即可：

```
<img
  src={imgSrc}
  onError={event => {
    event.currentTarget.src = defaultSrc;
  }}
/>
```

### 判断对象中是否存在某个属性的三种方法

1. hasOwnProperty()

`hasOwnProperty`方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（不包含原型上的属性）：

```
({ a: 1 }).hasOwnProperty('a'); // true
({ a: 1 }).hasOwnProperty('toString'); // false
```

2. in 操作符

`in 操作符`会返回一个布尔值，指示对象自身属性中是否具有指定的属性（包含原型上的属性）：

```
'a' in { a: 1 }; // true
'toString' in { a: 1 }; // true
```

3. Reflect.has()

`Reflect.has`作用与`in 操作符`相同：

```
Reflect.has({ a: 1 }, 'a'); // true
Reflect.has({ a: 1 }, 'toString'); // true
```

### 实现深拷贝

简易版

> 弊端 function、null、undefined

```
const newData = JSON.parse(JSON.stringify(data));
```

cloneDeep

```
export const cloneDeep = <T>(obj: T, map = new WeakMap()): T => {
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
```

### 隐藏元素之 display、visibility、opacity

|                  | **display: none** | **visibility: hidden** | **opacity: 0** |
| ---------------- | ----------------- | ---------------------- | -------------- |
| **是否生成盒子** | 否                | 是                     | 是             |
| **是否占据空间** | 否                | 是                     | 是             |
| **是否可以交互** | 否                | 否                     | 是             |
| **是否参与回流** | 否                | 是                     | 是             |
| **是否参与重绘** | 否                | 否                     | 是             |
