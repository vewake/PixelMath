"use client"

import { useState, useEffect, useRef } from "react"

export default function ImageBlending(image: any) {
  const [blendFactor, setBlendFactor] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image1, setImage1] = useState<HTMLImageElement | null>(null)
  const [image2, setImage2] = useState<HTMLImageElement | null>(null)
  const [imageBase64, setImageBase64] = useState("");

  useEffect(() => {
    const img1 = new Image()
    const img2 = new Image()
    img1.src = "/gopher.jpg"
    img2.src = image.image || "/vercel.svg"
    img1.onload = () => setImage1(img1)
    img2.onload = () => setImage2(img2)
  }, [])

  useEffect(() => {
    if (image1 && image2) {
      blendImages(image1, image2, blendFactor)
    }
  }, [image1, image2, blendFactor])

  const blendImages = (img1: HTMLImageElement, img2: HTMLImageElement, alpha: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = img1.width
    canvas.height = img1.height

    // Draw the first image
    ctx.drawImage(img1, 0, 0)
    const img1Data = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Draw the second image
    ctx.drawImage(img2, 0, 0)
    const img2Data = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Blend the images
    const blendedData = ctx.createImageData(canvas.width, canvas.height)

    for (let i = 0; i < img1Data.data.length; i += 4) {
      blendedData.data[i] = alpha * img1Data.data[i] + (1 - alpha) * img2Data.data[i] // Red
      blendedData.data[i + 1] = alpha * img1Data.data[i + 1] + (1 - alpha) * img2Data.data[i + 1] // Green
      blendedData.data[i + 2] = alpha * img1Data.data[i + 2] + (1 - alpha) * img2Data.data[i + 2] // Blue
      blendedData.data[i + 3] = 255 // Alpha (fully opaque)
    }

    // Put the blended image data back on the canvas
    ctx.putImageData(blendedData, 0, 0)
  }


  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mt-16 text-center">
        <label className="block mb-2 font-semibold">Upload another Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border rounded-md"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4">4. Image Blending</h2>
      <div className="flex items-center space-x-4">
        <canvas ref={canvasRef} className="border border-gray-300" width="200" height="200" />
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
          <p>Blend Factor (α): {blendFactor.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Formula: Iblend(x,y) = α * I1(x,y) + (1-α) * I2(x,y)</p>
        <p className="text-sm text-gray-600">
          Where I1 and I2 are the pixel intensities of the two images, and α is the blending factor.
        </p>
      </div>
    </div>
  )
}


