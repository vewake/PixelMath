"use client";

import { useState } from "react";
import BrightnessAdjustment from "../components/BrightnessAdjustment";
import ColorCorrection from "../components/ColorCorrection";
import ImageBlurring from "../components/ImageBlurring";

export default function MathVisualizer() {
  const [selectedOption, setSelectedOption] = useState("Brightness");
  const [imageBase64, setImageBase64] = useState("");

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
    <div className="container mx-auto p-4 relative">
      <div className="mt-16 text-center">
        <label className="block mb-2 font-semibold">Upload an Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white rounded-full shadow-lg flex space-x-4 py-2 px-6 z-50">
        <button
          className={`py-1 px-3 rounded-full ${selectedOption === "Brightness" ? "bg-blue-500" : "bg-gray-700"
            }`}
          onClick={() => setSelectedOption("Brightness")}
        >
          Brightness Adjustment
        </button>
        <button
          className={`py-1 px-3 rounded-full ${selectedOption === "Color" ? "bg-blue-500" : "bg-gray-700"
            }`}
          onClick={() => setSelectedOption("Color")}
        >
          Color Correction
        </button>
        <button
          className={`py-1 px-3 rounded-full ${selectedOption === "Blur" ? "bg-blue-500" : "bg-gray-700"
            }`}
          onClick={() => setSelectedOption("Blur")}
        >
          Image Blurring
        </button>
      </div>

      <div className="mt-12 space-y-12">
        {selectedOption === "Brightness" && <BrightnessAdjustment image={imageBase64} />}
        {selectedOption === "Color" && <ColorCorrection image={imageBase64} />}
        {selectedOption === "Blur" && <ImageBlurring image={imageBase64} />}
      </div>
    </div>
  );
}

