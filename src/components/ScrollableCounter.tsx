import { useRef, useEffect, useCallback, useState, startTransition } from "react";
import { cn } from "@/lib/utils";

const DEAD_ZONE = 25;
const ITEM_HEIGHT = 28;

// デッドゾーン外の距離をべき乗カーブで速度に変換する。
// 上方向（originY - currentY > 0）が正の速度（値増加）、
// 下方向が負の速度（値減少）となる。
function distanceToSpeed(distance: number): number {
  const absDistance = Math.abs(distance);
  if (absDistance <= DEAD_ZONE) return 0;
  const effective = absDistance - DEAD_ZONE;
  const speed = Math.pow(effective / 20, 1.5) * 2;
  // 上方向（distance > 0）→ 値増加（正の速度）、下方向 → 値減少（負の速度）
  return distance > 0 ? speed : -speed;
}

interface ScrollableCounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function ScrollableCounter({
  value,
  min = 0,
  max = 999,
  onChange,
  className,
}: ScrollableCounterProps) {
  const prev = value - 1;
  const next = value + 1;

  const [pulsing, setPulsing] = useState(false);
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setPulsing(true);
      const id = setTimeout(() => setPulsing(false), 80);
      return () => clearTimeout(id);
    }
  }, [value]);

  // rAF コールバック内のクロージャが古い props を参照しないよう、
  // ref で最新値を追跡する。
  const valueRef = useRef(value);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    minRef.current = min;
  }, [min]);
  useEffect(() => {
    maxRef.current = max;
  }, [max]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const originYRef = useRef(0);
  const currentYRef = useRef(0);
  const accumulatorRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const lastTimeRef = useRef(0);

  const tick = useCallback(() => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    const distance = originYRef.current - currentYRef.current;
    const speed = distanceToSpeed(distance);

    accumulatorRef.current += speed * dt;

    const steps = Math.trunc(accumulatorRef.current);
    if (steps !== 0) {
      accumulatorRef.current -= steps;
      let newValue = valueRef.current + steps;
      newValue = Math.max(minRef.current, Math.min(maxRef.current, newValue));
      if (newValue !== valueRef.current) {
        valueRef.current = newValue;
        startTransition(() => {
          onChangeRef.current(newValue);
        });
        navigator.vibrate?.(1);
      }
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      originYRef.current = e.clientY;
      currentYRef.current = e.clientY;
      accumulatorRef.current = 0;
      isDraggingRef.current = true;
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    currentYRef.current = e.clientY;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // コンポーネントアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      isDraggingRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && value < max) {
      onChange(value + 1);
    } else if (e.key === "ArrowDown" && value > min) {
      onChange(value - 1);
    }
  };

  // React の onWheel は passive リスナーのため preventDefault() が効かない。
  // ネイティブリスナーで { passive: false } を指定してページスクロールを抑制する。
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0 && valueRef.current < maxRef.current) {
        onChangeRef.current(valueRef.current + 1);
      } else if (e.deltaY > 0 && valueRef.current > minRef.current) {
        onChangeRef.current(valueRef.current - 1);
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label="チップ枚数"
      tabIndex={0}
      className={cn(
        "relative select-none touch-none cursor-ns-resize overflow-hidden rounded-lg w-16",
        className,
      )}
      style={{ height: ITEM_HEIGHT * 3 }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* グラデーションオーバーレイ（上） */}
      <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* 中央ハイライトバー */}
      <div
        className="absolute inset-x-0 z-0 border-y border-primary/20 bg-primary/5 rounded-sm"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />

      {/* 数値表示 */}
      <div className="relative z-[1]">
        <div
          className="flex items-center justify-center text-xs text-muted-foreground/40 tabular-nums"
          style={{ height: ITEM_HEIGHT }}
        >
          {prev >= min && <span>{prev}</span>}
        </div>
        <div
          className="flex items-center justify-center text-base font-semibold text-foreground tabular-nums"
          style={{ height: ITEM_HEIGHT }}
        >
          <span
            data-pulsing={pulsing || undefined}
            className="transition-transform duration-75"
            style={{ transform: pulsing ? "scale(1.08)" : "scale(1)" }}
          >
            {value}
          </span>
        </div>
        <div
          className="flex items-center justify-center text-xs text-muted-foreground/40 tabular-nums"
          style={{ height: ITEM_HEIGHT }}
        >
          {next <= max && <span>{next}</span>}
        </div>
      </div>

      {/* グラデーションオーバーレイ（下） */}
      <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
