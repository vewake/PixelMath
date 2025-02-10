"use client"
import { useState, useEffect, useRef } from "react"
import { type Matrix, multiplyMatrix, clamp } from "../utils/matrix"

export default function BrightnessAdjustment(image: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [brightness, setBrightness] = useState(1)
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


  return (
    <div className="p-6 space-y-6 bg-gray-50 border-4 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-4"> Brightness Adjustment</h2>
      <div className="flex items-center space-x-4">
        <div className="flex flex-row items-center justify-center gap-8 w-full">
          <div>
            <canvas ref={canvasRef}
              className="border border-gray-300 rounded-md shadow-sm w-64 h-64"
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={brightness}
              onChange={(e) => {
                setBrightness(Number.parseFloat(e.target.value))
                setscalingMatrix([
                  [brightness, 0, 0],
                  [0, brightness, 0],
                  [0, 0, brightness],
                ])
              }}
              className="w-64"
            />
            <p className="mt-2 text-center">Brightness: {brightness.toFixed(1)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
