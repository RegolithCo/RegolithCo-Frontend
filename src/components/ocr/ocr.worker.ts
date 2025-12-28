// Polyfill for OCR library which depends on DOM in workers
/* eslint-disable @typescript-eslint/no-explicit-any */
const global = globalThis as any

if (typeof global.document === 'undefined') {
  global.document = {
    createElement: (tagName: string) => {
      if (tagName === 'canvas') {
        const canvas = new OffscreenCanvas(1, 1)
        ;(canvas as any).style = {}
        return canvas
      }
      return { style: {} }
    },
    body: {
      append: () => {},
    },
  }
}

if (typeof global.Image === 'undefined') {
  global.Image = class {
    onload: (() => void) | null = null
    onerror: ((err: unknown) => void) | null = null
    src: string = ''
    width: number = 0
    height: number = 0
    naturalWidth: number = 0
    naturalHeight: number = 0
    private _bitmap: ImageBitmap | null = null

    async decode() {
      try {
        const response = await fetch(this.src)
        const blob = await response.blob()
        const bitmap = await createImageBitmap(blob)
        this._bitmap = bitmap
        this.width = bitmap.width
        this.height = bitmap.height
        this.naturalWidth = bitmap.width
        this.naturalHeight = bitmap.height
        if (this.onload) this.onload()
      } catch (e) {
        if (this.onerror) this.onerror(e)
        throw e
      }
    }
  }

  // Proxy drawImage to handle our fake Image class
  const originalDrawImage = OffscreenCanvasRenderingContext2D.prototype.drawImage
  OffscreenCanvasRenderingContext2D.prototype.drawImage = function (
    this: OffscreenCanvasRenderingContext2D,
    image: any,
    ...args: any[]
  ) {
    if (image && image._bitmap) {
      return (originalDrawImage as any).apply(this, [image._bitmap, ...args])
    }
    return (originalDrawImage as any).apply(this, [image, ...args])
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import { env } from 'onnxruntime-web'
import { parseShipMiningOrder, parseShipRock } from '@regolithco/ocr'
import { ShipMiningOrderCapture, ShipRockCapture } from '@regolithco/common'
import { CaptureTypeEnum } from './types'

// Configure WASM path to root
env.wasm.wasmPaths = '/ort/'

export interface WorkerMessageData {
  imageUrl: string
  captureType: CaptureTypeEnum
}

export interface WorkerResultData {
  result?: ShipMiningOrderCapture | ShipRockCapture
  error?: string
}

self.onmessage = async (event: MessageEvent<WorkerMessageData>) => {
  const { imageUrl, captureType } = event.data

  try {
    let result: unknown
    if (captureType === CaptureTypeEnum.REFINERY_ORDER) {
      result = await parseShipMiningOrder(imageUrl)
    } else if (captureType === CaptureTypeEnum.SHIP_ROCK) {
      result = await parseShipRock(imageUrl)
    }

    if (result) {
      // Small hack to handle BigInt if necessary, though it's better to do it in the main thread
      // if we want to keep the types clean. But we can pass it as is if structured clone supports it.
      // Structured clone supports BigInt!
      self.postMessage({ result } as WorkerResultData)
    } else {
      self.postMessage({ error: 'Scan could not be captured' } as WorkerResultData)
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Scan could not be captured'
    self.postMessage({ error } as WorkerResultData)
  }
}
