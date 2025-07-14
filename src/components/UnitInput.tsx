import { formatInputValue, parseUnitValue } from "@/lib/format-numbers"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"

interface UnitInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  placeholder?: string
}

export default function UnitInput({ value, onChange, className, placeholder }: UnitInputProps) {
  const [inputValue, setInputValue] = useState(formatInputValue(value))

  useEffect(() => {
    setInputValue(formatInputValue(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.currentTarget.value
    setInputValue(newInputValue)

    const parsedValue = parseUnitValue(newInputValue)
    onChange(parsedValue)
  }

  const handleBlur = () => {
    // フォーカスが外れたときに値を正規化
    const parsedValue = parseUnitValue(inputValue)
    const formattedValue = formatInputValue(parsedValue)
    setInputValue(formattedValue)
  }

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      placeholder={placeholder || "例: 100, 1K, 2.5M"}
    />
  )
}
