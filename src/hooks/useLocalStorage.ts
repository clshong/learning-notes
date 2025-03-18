/**
 * @description 通过 key 存取 localStorage 数据
 */
export function useLocalStorage() {
  /**
   * 获取 localStorage 数据
   * @param key 键名
   * @returns 解析后的数据
   */
  const getItem = <T = string>(key: string): T | null => {
    const data = localStorage.getItem(key);
    try {
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.warn(`Error parsing localStorage key "${key}":`, error);
      return null;
    }
  };

  /**
   * 设置 localStorage 数据
   * @param key 键名
   * @param value 存储的数据
   */
  const setItem = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  /**
   * 删除指定 key 的数据
   * @param key 键名
   */
  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  /**
   * 清空 localStorage
   */
  const clear = (): void => {
    localStorage.clear();
  };

  return {
    getItem,
    setItem,
    removeItem,
    clear,
  };
}
