import type { RefObject } from "react"
import { useEffect, useState } from "react"
import { ImageIcon, Loader2, Share2 } from "lucide-react"
import { toast } from "sonner"
import { captureGraphImage } from "@/lib/capture-graph"
import { calculateShareSummary, generateShareText } from "@/lib/session-share"
import { shareResult } from "@/lib/share-result"
import type { Session } from "@/lib/stack-history"
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
  graphRef?: RefObject<HTMLDivElement | null>
}

export default function ShareDialog({
  open,
  onOpenChange,
  session,
  graphRef,
}: ShareDialogProps) {
  const summary = calculateShareSummary(session)
  const shareText = summary ? generateShareText(summary) : null
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    if (!open) {
      setImagePreview(null)
      setImageFile(null)
      return
    }

    const element = graphRef?.current
    if (!element) return

    let cancelled = false
    setCapturing(true)

    captureGraphImage(element)
      .then((blob) => {
        if (cancelled) return
        setImagePreview(URL.createObjectURL(blob))
        setImageFile(new File([blob], "stack-graph.png", { type: "image/png" }))
      })
      .catch(() => {
        // キャプチャ失敗時はテキストのみでシェアする
      })
      .finally(() => {
        if (!cancelled) setCapturing(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, graphRef])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleShare = async () => {
    if (!shareText) return
    await shareResult(shareText, undefined, imageFile ?? undefined)
    if (typeof navigator.share !== "function") {
      toast.success("クリップボードにコピーしました")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>セッション結果を共有</DialogTitle>
          <DialogDescription>
            セッションの損益と経過時間をシェアできます
          </DialogDescription>
        </DialogHeader>

        {shareText ? (
          <div className="space-y-3">
            <div className="rounded-md bg-muted p-3 text-sm font-mono break-all">
              {shareText}
            </div>

            {capturing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                グラフをキャプチャ中...
              </div>
            )}

            {imagePreview && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ImageIcon className="h-3 w-3" />
                  添付画像
                </div>
                <img
                  src={imagePreview}
                  alt="スタックグラフ"
                  className="rounded-md border border-border w-full"
                />
              </div>
            )}

            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              {imageFile ? "画像付きでシェア" : "シェア"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            スナップショットを2件以上記録するとセッション結果をシェアできます
          </p>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
