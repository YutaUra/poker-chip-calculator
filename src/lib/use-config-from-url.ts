import { useEffect, useRef } from "react"
import { toast } from "sonner"
import type { ShareConfig } from "@/lib/session-share"
import { decodeChipConfig } from "@/lib/session-share"

export function parseConfigFromUrl(url: string): ShareConfig | null {
  try {
    const parsed = new URL(url)
    const configParam = parsed.searchParams.get("config")
    if (!configParam) return null
    return decodeChipConfig(configParam)
  } catch {
    return null
  }
}

export function useConfigFromUrl(
  onApplyConfig: (config: ShareConfig) => void,
): void {
  const appliedRef = useRef(false)

  useEffect(() => {
    if (appliedRef.current) return
    appliedRef.current = true

    const config = parseConfigFromUrl(window.location.href)
    if (!config) return

    onApplyConfig(config)
    toast.success("共有されたチップ設定を復元しました")

    // URLからconfigパラメータを除去して履歴を綺麗にする
    const url = new URL(window.location.href)
    url.searchParams.delete("config")
    window.history.replaceState(null, "", url.toString())
  }, [onApplyConfig])
}
