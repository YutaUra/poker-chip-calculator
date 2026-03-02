export const supportsHaptic =
  typeof window !== "undefined"
    ? window.matchMedia("(pointer: coarse)").matches
    : false

/**
 * Type guard to check if navigator supports vibrate API
 */
function hasVibrate(
  nav: Navigator
): nav is Navigator & { vibrate: (pattern: number | number[]) => boolean } {
  return "vibrate" in nav && typeof nav.vibrate === "function"
}

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
 *
 * @param pattern - Vibration duration (ms) or pattern.
 * Custom patterns only work on Android devices. iOS uses fixed feedback.
 * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
 *
 * @example
 * import { haptic } from "@/lib/haptic"
 *
 * <Button onClick={() => haptic()}>Haptic</Button>
 */
export function haptic(pattern: number | number[] = 50) {
  try {
    if (!supportsHaptic) return

    if (hasVibrate(navigator)) {
      navigator.vibrate(pattern)
      return
    }

    // iOS haptic trick via checkbox switch element (iOS 18+)
    // display: none だとレンダリングツリーから除外され
    // Safari がハプティクスを発火しないため、
    // offscreen 配置で視覚的に隠す。
    const label = document.createElement("label")
    label.ariaHidden = "true"
    Object.assign(label.style, {
      position: "fixed",
      left: "-9999px",
      opacity: "0",
    })

    const input = document.createElement("input")
    input.type = "checkbox"
    input.setAttribute("switch", "")
    label.appendChild(input)

    try {
      document.body.appendChild(label)
      input.click()
    } finally {
      document.body.removeChild(label)
    }
  } catch {}
}
