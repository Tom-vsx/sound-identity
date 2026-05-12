export function toRoman(n: number): string {
  const vals = [50, 40, 10, 9, 5, 4, 1]
  const syms = ['L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
  let result = ''
  let num = Math.min(Math.max(n, 1), 99)
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i]
      num -= vals[i]
    }
  }
  return result
}
