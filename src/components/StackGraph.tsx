import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { formatChipAmount } from "@/lib/format-numbers"
import type { Session, StackSnapshot } from "@/lib/stack-history"

interface StackGraphProps {
  session: Session
  onSnapshotClick?: (snapshotId: string) => void
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: StackSnapshot }>
}) {
  if (!active || !payload?.[0]) return null
  const snap = payload[0].payload

  return (
    <div className="rounded-lg bg-popover border border-border px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">#{snap.recordNumber}</p>
      <p className="text-muted-foreground">{formatTime(snap.timestamp)}</p>
      <p className="text-primary">{snap.bbValue.toFixed(1)} BB</p>
      <p className="text-emerald-400">{formatChipAmount(snap.totalChips)} chips</p>
      {snap.memo && (
        <p className="text-muted-foreground italic mt-1">{snap.memo}</p>
      )}
    </div>
  )
}

export default function StackGraph({ session, onSnapshotClick }: StackGraphProps) {
  const { snapshots } = session

  if (snapshots.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-8 text-center">
        <p className="text-muted-foreground">
          記録ボタンを押してスタックを記録しましょう
        </p>
      </div>
    )
  }

  const startBB = snapshots[0].bbValue

  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center gap-4 mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
          スタック推移
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={snapshots}>
          <XAxis
            dataKey="recordNumber"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="bb"
            orientation="left"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
            width={35}
          />
          <YAxis
            yAxisId="chips"
            orientation="right"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatChipAmount(v)}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="line"
            wrapperStyle={{ fontSize: 11 }}
          />
          <ReferenceLine
            yAxisId="bb"
            y={startBB}
            stroke="oklch(0.6 0.05 90)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <Line
            yAxisId="bb"
            type="monotone"
            dataKey="bbValue"
            name="BB"
            stroke="oklch(0.80 0.135 80)"
            strokeWidth={2}
            dot={{ r: 3, fill: "oklch(0.80 0.135 80)" }}
            activeDot={{
              r: 5,
              cursor: onSnapshotClick ? "pointer" : "default",
              onClick: (_: unknown, payload: { payload?: StackSnapshot }) => {
                if (onSnapshotClick && payload?.payload) {
                  onSnapshotClick(payload.payload.id)
                }
              },
            }}
          />
          <Line
            yAxisId="chips"
            type="monotone"
            dataKey="totalChips"
            name="Chips"
            stroke="oklch(0.65 0.15 160)"
            strokeWidth={2}
            dot={{ r: 3, fill: "oklch(0.65 0.15 160)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
