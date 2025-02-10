"use client"

import { useState, useEffect, useRef } from "react"
import { type Matrix, multiplyMatrix, clamp } from "../utils/matrix"

export default function BrightnessAdjustment(image: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scalingMatrix, setscalingMatrix] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])

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
      applyBrightnessAdjustment(ctx,)
    }
  }, [scalingMatrix])

  const applyBrightnessAdjustment = (ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const data = imageData.data


    // change custom matrix

    for (let i = 0; i < data.length; i += 4) {
      const pixel: Matrix = [[data[i]], [data[i + 1]], [data[i + 2]]]
      const adjustedPixel = multiplyMatrix(scalingMatrix, pixel)
      data[i] = clamp(adjustedPixel[0][0], 0, 255)
      data[i + 1] = clamp(adjustedPixel[1][0], 0, 255)
      data[i + 2] = clamp(adjustedPixel[2][0], 0, 255)
    }

    ctx.putImageData(imageData, 0, 0)
  }


  const handlescalingMatrixChange = (row: number, col: number, value: string) => {
    const newScalingMatrix = [...scalingMatrix]
    newScalingMatrix[row][col] = Number.parseFloat(value) || 0
    setscalingMatrix(newScalingMatrix)
  }
  return (
    <div className="p-6 space-y-6 bg-gray-50 border-4 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold text-gray-800"> Scaling Matrix for Color Correction </h2>
      <div className="flex flex-row justify-center items-center gap-8">

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded-md shadow-sm w-64 h-64"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Custom Scaling Matrix </h3>
            <div
              className="grid gap-2 bg-gray-100 p-4 rounded-md shadow-inner"
              style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
            >
              {scalingMatrix.map((row, i) =>
                row.map((value, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    value={value}
                    step="0.1"
                    onChange={(e) => handlescalingMatrixChange(i, j, e.target.value)}
                    className="w-12 h-12 text-center text-sm border border-gray-300 rounded shadow-sm"
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div>
          {/* <input */}
          {/*           type="range" */}
          {/*           min="0" */}
          {/*           max="2" */}
          {/*           step="0.1" */}
          {/*           value={brightness} */}
          {/*           onChange={(e) => setBrightness(Number.parseFloat(e.target.value))} */}
          {/*           className="w-64" */}
          {/*         /> */}
          {/**/}
        </div>
      </div>

    </div>
  );
}











