# Maths Case Study — Image Processing Playground

An interactive Next.js web app that demonstrates core image-processing operations through hands-on manipulation of pixel data on the HTML `<canvas>`. Each operation is backed by the underlying math — matrix multiplication for color/brightness transforms, convolution kernels for blurring, and linear interpolation for blending — made visible and tweakable in real time.

Built as a case study for understanding the mathematics behind common image operations.

## Features

Upload any image (or use the default Gofer), then switch between four operations:

### 1. Brightness Adjustment
Scales every pixel's RGB values by a diagonal scaling matrix. A single slider controls the scaling factor `k`, applied as:

```
[ k 0 0 ]   [ R ]
[ 0 k 0 ] × [ G ]
[ 0 0 k ]   [ B ]
```

Each pixel is treated as a 3×1 column vector and multiplied by the matrix, then clamped to `[0, 255]`.

### 2. Color Correction
The same matrix-multiplication approach as brightness, but exposes the full 3×3 scaling matrix for manual editing. Tweaking the diagonal scales each channel independently; off-diagonal values let you mix channels (e.g. feed green into red) for custom color grading.

### 3. Image Blurring
Applies a convolution kernel across the image. Choose a kernel size (3×3 up to 15×15) via a uniform box blur, or toggle a custom kernel (up to 5×5) and enter your own weights — Gaussian, sharpen, edge-detect, anything. The kernel is convolved over every pixel, averaging neighbor contributions weighted by the kernel.

### 4. Image Blending
Linearly blends two images with an alpha factor `α`:

```
I_blend(x,y) = α · I₁(x,y) + (1 − α) · I₂(x,y)
```

Upload a second image and drag the slider to control how much of each image contributes to the result.

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** utilities (`class-variance-authority`, `clsx`, `tailwind-merge`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx            # Main UI: image upload + operation switcher
  layout.tsx          # Root layout
components/
  BrightnessAdjustment.tsx
  ColorCorrection.tsx
  ImageBlurring.tsx
  ImageBlending.tsx
utils/
  matrix.ts           # Matrix multiply + clamp helpers
```

## Notes

All pixel processing happens client-side via the Canvas API's `ImageData` — no server, no external image libraries. The math is implemented from scratch (`utils/matrix.ts`) to keep the operations transparent and educational.
