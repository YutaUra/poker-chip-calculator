const units = [
  { label: "1", value: 1 },
  { label: "K", value: 1000 },
  { label: "M", value: 1000000 },
  { label: "B", value: 1000000000 },
  { label: "T", value: 1000000000000 },
] as const
export type Unit = (typeof units)[number]["label"]
export const calculateUnitValue = (amount: number, unit: Unit): number => {
  const unitValue = units.find(u => u.label === unit)?.value || 1
  return amount * unitValue
}
