export async function captureGraphImage(element: HTMLElement): Promise<Blob> {
  // html2canvas を使わない理由:
  // Tailwind CSS 4 のテーマ色と StackGraph の色指定は oklch() だが、
  // html2canvas（1.x、メンテ停止）は oklch をパースできず例外を投げるため、
  // iOS Safari 等でキャプチャが常に失敗していた。
  // modern-screenshot は算出スタイルベースでレンダリングするため oklch を扱える。
  const { domToBlob } = await import("modern-screenshot")
  return domToBlob(element, {
    type: "image/png",
    scale: 2,
  })
}
