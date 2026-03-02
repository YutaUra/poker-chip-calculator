import { useState } from "react"
import { Share2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "@/lib/stack-history"
import type { ShareConfig } from "@/lib/session-share"
import { calculateShareSummary, generateShareText, encodeChipConfig } from "@/lib/session-share"
import { shareResult } from "@/lib/share-result"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
  chipConfig: ShareConfig
}

export default function ShareDialog({
  open,
  onOpenChange,
  session,
  chipConfig,
}: ShareDialogProps) {
  const [copiedConfig, setCopiedConfig] = useState(false)

  const summary = calculateShareSummary(session)
  const shareText = summary ? generateShareText(summary) : null
  const configUrl = `${window.location.origin}${window.location.pathname}?config=${encodeChipConfig(chipConfig)}`

  const handleShareSession = async () => {
    if (!shareText) return
    await shareResult(shareText)
    // navigator.share 非対応（クリップボードコピー）の場合のみ toast を表示。
    // navigator.share 対応時は OS 側のシェアシートが表示されるため toast 不要。
    if (typeof navigator.share !== "function") {
      toast.success("クリップボードにコピーしました")
    }
  }

  const handleCopyConfigUrl = async () => {
    try {
      await navigator.clipboard.writeText(configUrl)
      setCopiedConfig(true)
      toast.success("設定URLをコピーしました")
      setTimeout(() => setCopiedConfig(false), 2000)
    } catch {
      toast.error("コピーに失敗しました")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>セッション共有</DialogTitle>
          <DialogDescription>
            セッション結果やチップ設定を共有できます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Result Share */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">セッション結果</h3>
            {shareText ? (
              <>
                <div className="rounded-md bg-muted p-3 text-sm font-mono break-all">
                  {shareText}
                </div>
                <Button
                  onClick={handleShareSession}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  シェア
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                スナップショットを2件以上記録するとセッション結果をシェアできます
              </p>
            )}
          </div>

          {/* Chip Config URL */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">チップ設定URL</h3>
            <div className="rounded-md bg-muted p-3 text-xs font-mono break-all max-h-20 overflow-y-auto">
              {configUrl}
            </div>
            <Button
              variant="outline"
              onClick={handleCopyConfigUrl}
              className="w-full"
            >
              {copiedConfig ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copiedConfig ? "コピーしました" : "設定URLをコピー"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
