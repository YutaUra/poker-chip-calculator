export async function captureGraphImage(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
  })

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error("Failed to capture graph image"))
      }
    })
  })
}
