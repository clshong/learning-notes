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
