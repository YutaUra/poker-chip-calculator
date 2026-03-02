import { Share2 } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "@/lib/stack-history"
import { calculateShareSummary, generateShareText } from "@/lib/session-share"
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
}

export default function ShareDialog({
  open,
  onOpenChange,
  session,
}: ShareDialogProps) {
  const summary = calculateShareSummary(session)
  const shareText = summary ? generateShareText(summary) : null

  const handleShare = async () => {
    if (!shareText) return
    await shareResult(shareText)
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
            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              シェア
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
