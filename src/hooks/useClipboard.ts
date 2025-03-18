/**
 * @description 复制到剪切板
 */

export function useClipboard() {
  /**
   * @param text
   * @returns
   */

  const copy = (text: string) => {
    try {
      alert("复制成功");
      return navigator.clipboard.writeText(text) as unknown;
    } catch (error) {
      console.log("复制失败");
      throw error;
    }
  };

  return {
    copy,
  };
}
