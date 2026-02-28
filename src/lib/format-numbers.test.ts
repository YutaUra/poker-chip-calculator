import { describe, it, expect } from "vitest"
import {
  formatChipAmount,
  formatFullNumber,
  parseUnitValue,
  formatInputValue,
} from "./format-numbers"

describe("formatChipAmount", () => {
  it("0の場合は'0'を返す", () => {
    expect(formatChipAmount(0)).toBe("0")
  })

  describe("千未満の数値はそのまま表示する", () => {
    it.each([
      [1, "1"],
      [5, "5"],
      [10, "10"],
      [100, "100"],
      [999, "999"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatChipAmount(input)).toBe(expected)
    })
  })

  describe("千以上はK表記に変換する", () => {
    it.each([
      [1000, "1K"],
      [1500, "1.5K"],
      [2000, "2K"],
      [10000, "10K"],
      [100000, "100K"],
      [999000, "999K"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatChipAmount(input)).toBe(expected)
    })
  })

  describe("百万以上はM表記に変換する", () => {
    it.each([
      [1000000, "1M"],
      [2500000, "2.5M"],
      [10000000, "10M"],
      [100000000, "100M"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatChipAmount(input)).toBe(expected)
    })
  })

  describe("十億以上はB表記に変換する", () => {
    it.each([
      [1000000000, "1B"],
      [5000000000, "5B"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatChipAmount(input)).toBe(expected)
    })
  })

  describe("兆以上はT表記に変換する", () => {
    it.each([
      [1000000000000, "1T"],
      [3000000000000, "3T"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatChipAmount(input)).toBe(expected)
    })
  })

  it("有効数字3桁で丸められる", () => {
    // 9,999,900 は有効数字3桁のcompact notationで "10M" になる
    expect(formatChipAmount(9999900)).toBe("10M")
  })

  it("小数点付きのコンパクト表記を正しく表示する", () => {
    expect(formatChipAmount(4500)).toBe("4.5K")
    expect(formatChipAmount(1230000)).toBe("1.23M")
  })
})

describe("formatFullNumber", () => {
  it("0をフォーマットする", () => {
    expect(formatFullNumber(0)).toBe("0")
  })

  it("千未満の数値はカンマなし", () => {
    expect(formatFullNumber(1)).toBe("1")
    expect(formatFullNumber(999)).toBe("999")
  })

  it("千以上はカンマ区切りにする", () => {
    expect(formatFullNumber(1000)).toBe("1,000")
    expect(formatFullNumber(10000)).toBe("10,000")
    expect(formatFullNumber(100000)).toBe("100,000")
  })

  it("百万以上はカンマ2つで区切る", () => {
    expect(formatFullNumber(1000000)).toBe("1,000,000")
    expect(formatFullNumber(1234567)).toBe("1,234,567")
  })

  it("十億以上も正しくフォーマットする", () => {
    expect(formatFullNumber(1000000000)).toBe("1,000,000,000")
  })

  it("小数を含む数値をフォーマットする", () => {
    expect(formatFullNumber(1234.56)).toBe("1,234.56")
  })
})

describe("parseUnitValue", () => {
  describe("空・無効な入力", () => {
    it("空文字列の場合は0を返す", () => {
      expect(parseUnitValue("")).toBe(0)
    })

    it("空白のみの場合は0を返す", () => {
      expect(parseUnitValue("   ")).toBe(0)
    })

    it("数値でない文字列の場合は0を返す", () => {
      expect(parseUnitValue("abc")).toBe(0)
    })

    it("単位のみの場合は0を返す", () => {
      expect(parseUnitValue("K")).toBe(0)
    })
  })

  describe("単位なしの数値", () => {
    it("整数をそのまま返す", () => {
      expect(parseUnitValue("100")).toBe(100)
      expect(parseUnitValue("0")).toBe(0)
    })

    it("小数をそのまま返す", () => {
      expect(parseUnitValue("1.5")).toBe(1.5)
    })

    it("前後の空白を無視する", () => {
      expect(parseUnitValue("  100  ")).toBe(100)
    })
  })

  describe("K (千) 単位", () => {
    it("整数K", () => {
      expect(parseUnitValue("1K")).toBe(1000)
      expect(parseUnitValue("5K")).toBe(5000)
      expect(parseUnitValue("100K")).toBe(100000)
    })

    it("小数K", () => {
      expect(parseUnitValue("2.5K")).toBe(2500)
      expect(parseUnitValue("0.5K")).toBe(500)
    })

    it("小文字kも認識する", () => {
      expect(parseUnitValue("1k")).toBe(1000)
    })
  })

  describe("M (百万) 単位", () => {
    it("整数M", () => {
      expect(parseUnitValue("1M")).toBe(1000000)
      expect(parseUnitValue("10M")).toBe(10000000)
    })

    it("小数M", () => {
      expect(parseUnitValue("1.5M")).toBe(1500000)
    })

    it("小文字mも認識する", () => {
      expect(parseUnitValue("1m")).toBe(1000000)
    })
  })

  describe("B (十億) 単位", () => {
    it("整数B", () => {
      expect(parseUnitValue("1B")).toBe(1000000000)
    })

    it("小数B", () => {
      expect(parseUnitValue("2.5B")).toBe(2500000000)
    })

    it("小文字bも認識する", () => {
      expect(parseUnitValue("1b")).toBe(1000000000)
    })
  })

  describe("T (兆) 単位", () => {
    it("整数T", () => {
      expect(parseUnitValue("1T")).toBe(1000000000000)
    })

    it("小数T", () => {
      expect(parseUnitValue("1.5T")).toBe(1500000000000)
    })

    it("小文字tも認識する", () => {
      expect(parseUnitValue("1t")).toBe(1000000000000)
    })
  })
})

describe("formatInputValue", () => {
  it("0の場合は'0'を返す", () => {
    expect(formatInputValue(0)).toBe("0")
  })

  describe("千未満はそのまま数値文字列を返す", () => {
    it.each([
      [1, "1"],
      [100, "100"],
      [500, "500"],
      [999, "999"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatInputValue(input)).toBe(expected)
    })
  })

  describe("千で割り切れる場合はK表記を返す", () => {
    it.each([
      [1000, "1K"],
      [5000, "5K"],
      [100000, "100K"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatInputValue(input)).toBe(expected)
    })
  })

  describe("百万で割り切れる場合はM表記を返す", () => {
    it.each([
      [1000000, "1M"],
      [5000000, "5M"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatInputValue(input)).toBe(expected)
    })
  })

  describe("十億で割り切れる場合はB表記を返す", () => {
    it.each([
      [1000000000, "1B"],
      [5000000000, "5B"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatInputValue(input)).toBe(expected)
    })
  })

  describe("兆で割り切れる場合はT表記を返す", () => {
    it.each([
      [1000000000000, "1T"],
      [3000000000000, "3T"],
    ])("%d → '%s'", (input, expected) => {
      expect(formatInputValue(input)).toBe(expected)
    })
  })

  describe("割り切れない場合はより小さい単位またはそのまま返す", () => {
    it("1500はKで割り切れないので数値文字列を返す", () => {
      expect(formatInputValue(1500)).toBe("1500")
    })

    it("1500000はMで割り切れないがKで割り切れるのでK表記を返す", () => {
      // 1500000 % 1000000 !== 0 だが 1500000 % 1000 === 0
      expect(formatInputValue(1500000)).toBe("1500K")
    })

    it("1234は割り切れないのでそのまま返す", () => {
      expect(formatInputValue(1234)).toBe("1234")
    })
  })

  describe("parseUnitValueとの往復変換の一貫性", () => {
    it.each([0, 1, 100, 1000, 5000, 1000000, 1000000000, 1000000000000])(
      "%d をformatしてparseすると元の値に戻る",
      (value) => {
        expect(parseUnitValue(formatInputValue(value))).toBe(value)
      }
    )
  })
})
