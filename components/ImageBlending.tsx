"use client"

import { useState, useEffect, useRef } from "react"

export default function ImageBlending() {
  const [blendFactor, setBlendFactor] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img1 = new Image()
    const img2 = new Image()
    img1.src = "/gopher.jpg"
    img2.src = "/vercel.svg"

    let loadedImages = 0
    const onImageLoad = () => {
      loadedImages++
      if (loadedImages === 2) {
        canvas.width = img1.width
        canvas.height = img1.height
        blendImages(ctx, img1, img2, blendFactor)
      }
    }

    img1.onload = onImageLoad
    img2.onload = onImageLoad
  }, [blendFactor])

  const blendImages = (
    ctx: CanvasRenderingContext2D,
    img1: HTMLImageElement,
    img2: HTMLImageElement,
    alpha: number,
  ) => {
    ctx.drawImage(img1, 0, 0)
    ctx.globalAlpha = alpha
    ctx.drawImage(img2, 0, 0)
    ctx.globalAlpha = 1
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">4. Image Blending</h2>
      <div className="flex items-center space-x-4">
        <canvas ref={canvasRef} className="border border-gray-300" />
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={blendFactor}
            onChange={(e) => setBlendFactor(Number.parseFloat(e.target.value))}
            className="w-48"
          />
          <p>Blend Factor: {blendFactor.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

