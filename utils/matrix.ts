export type Matrix = number[][]

export function multiplyMatrix(a: Matrix, b: Matrix): Matrix {
  const result: Matrix = []
  for (let i = 0; i < a.length; i++) {
    result[i] = []
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

