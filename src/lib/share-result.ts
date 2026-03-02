function buildClipboardText(text: string, url?: string): string {
  if (url) return `${text}\n${url}`
  return text
}

async function copyToClipboard(text: string, url?: string): Promise<void> {
  await navigator.clipboard.writeText(buildClipboardText(text, url))
}

export async function shareResult(text: string, url?: string, file?: File): Promise<void> {
  if (typeof navigator.share === "function") {
    try {
      const shareData: ShareData = { text }
      if (url) shareData.url = url
      if (file && navigator.canShare?.({ files: [file] })) {
        shareData.files = [file]
      }
      await navigator.share(shareData)
      return
    } catch (error) {
      // ユーザーがシェアをキャンセルした場合は静かに無視する。
      // その他のエラー（シェアAPIの実装不備など）はクリップボードにフォールバックする。
      if (error instanceof DOMException && error.name === "AbortError") {
        return
      }
      await copyToClipboard(text, url)
      return
    }
  }

  await copyToClipboard(text, url)
}
