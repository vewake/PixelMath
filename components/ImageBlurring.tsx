"use client"

import { useState, useEffect, useRef } from "react"

export default function ImageBlurring(image: any) {
  const [kernelSize, setKernelSize] = useState(3)
  const [useCustomKernel, setUseCustomKernel] = useState(false)
  const [customKernel, setCustomKernel] = useState<number[][]>([
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = image.image || "/gopher.jpg"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      applyBlur(ctx, kernelSize, useCustomKernel ? customKernel : null)
    }
  }, [kernelSize, useCustomKernel, customKernel])

  useEffect(() => {
    // Initialize custom kernel when kernel size changes
    const newKernel = Array(kernelSize)
      .fill(0)
      .map(() => Array(kernelSize).fill(1 / (kernelSize * kernelSize)))
    setCustomKernel(newKernel)
  }, [kernelSize])

  const applyBlur = (ctx: CanvasRenderingContext2D, size: number, kernel: number[][] | null) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    // TODO: add option to half blur by changing the width 
    const data = imageData.data
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    const tempData = new Uint8ClampedArray(data)

    const halfSize = Math.floor(size / 2)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0
        let weightSum = 0

        for (let ky = -halfSize; ky <= halfSize; ky++) {
          for (let kx = -halfSize; kx <= halfSize; kx++) {
            const px = x + kx
            const py = y + ky

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const weight = kernel ? kernel[ky + halfSize][kx + halfSize] : 1
              const i = (py * width + px) * 4
              r += tempData[i] * weight
              g += tempData[i + 1] * weight
              b += tempData[i + 2] * weight
              a += tempData[i + 3] * weight
              weightSum += weight
            }
          }
        }

        const i = (y * width + x) * 4
        data[i] = r / weightSum
        data[i + 1] = g / weightSum
        data[i + 2] = b / weightSum
        data[i + 3] = a / weightSum
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const handleKernelChange = (row: number, col: number, value: string) => {
    const newKernel = [...customKernel]
    newKernel[row][col] = Number.parseFloat(value) || 0
    setCustomKernel(newKernel)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 border-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center"> Image Blurring</h2>
      <div className="flex items-center justify-center gap-8">
        <canvas ref={canvasRef}
          className="border border-gray-300 rounded-md shadow-sm w-64 h-64"
        />
        <div>
          <div className="mb-4">
            <label className="block mb-2">Kernel Size:</label>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={kernelSize}
              onChange={(e) => setKernelSize(Number.parseInt(e.target.value))}
              className="w-48"
            />
            <span className="ml-2">
              {kernelSize}x{kernelSize}
            </span>
          </div>
          {kernelSize <= 5 && (

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useCustomKernel}
                  onChange={(e) => setUseCustomKernel(e.target.checked)}
                  className="mr-2"
                />
                Use Custom Kernel
              </label>
            </div>
          )}
          {kernelSize <= 5 && useCustomKernel && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
                <h3 className="font-semibold mb-2">Custom Kernel:</h3>
                <div
                  className="grid gap-2 bg-gray-100 p-4 rounded-md shadow-inner"
                  style={{ gridTemplateColumns: `repeat(${kernelSize}, 1fr)` }}>
                  {customKernel.map((row, i) =>
                    row.map((value, j) => (
                      <input
                        key={`${i}-${j}`}
                        type="number"
                        value={value}
                        onChange={(e) => handleKernelChange(i, j, e.target.value)}
                        className="w-12 h-12 text-center text-sm border border-gray-300 rounded shadow-sm"
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
//TODO: try this later
// const gaussianKernel = [
//   [1, 4, 7, 4, 1],
//   [4, 16, 26, 16, 4],
//   [7, 26, 41, 26, 7],
//   [4, 16, 26, 16, 4],
//   [1, 4, 7, 4, 1],
// ].map(row => row.map(val => val / 273)); // Normalize kernel
//
// applyBlur(ctx, 5, gaussianKernel);
