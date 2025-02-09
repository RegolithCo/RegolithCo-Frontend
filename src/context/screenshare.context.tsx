import React, { createContext, useState, PropsWithChildren, useEffect } from 'react'

export interface ScreenshareContextType {
  stream: MediaStream | null
  startScreenCapture: () => Promise<void>
  stopScreenCapture: () => void
  startPreview: (videoRef: React.RefObject<HTMLVideoElement>) => void
  stopPreview: (videoRef: React.RefObject<HTMLVideoElement>) => void
  isScreenSharing: boolean
}

export const ScreenshareContext = createContext<ScreenshareContextType>({
  stream: null,
  startScreenCapture: async () => {
    throw new Error('ScreenshareProvider not found')
  },
  stopScreenCapture: () => {
    throw new Error('ScreenshareProvider not found')
  },
  startPreview: () => {
    throw new Error('ScreenshareProvider not found')
  },
  stopPreview: () => {
    throw new Error('ScreenshareProvider not found')
  },
  isScreenSharing: false,
})

export const ScreenshareProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'application', // Prompts the user to share a window
          frameRate: { ideal: 2, max: 5 },
          // volume: 0,
        },
      })
      setStream(stream)
    } catch (err) {
      console.error('Error: Unable to capture screen', err)
    }
  }

  // Clean up the stream when the component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop()
          track.enabled = false // Ensure the track is disabled
        })
      }
    }
  }, [stream])

  const stopScreenCapture = () => {
    if (stream) {
      // Stop all tracks in the stream
      stream.getTracks().forEach((track) => {
        track.stop()
        track.enabled = false // Ensure the track is disabled
      })

      // Release the stream
      setStream(null)
    }
  }

  const startPreview = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }
  }
  const stopPreview = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const isScreenSharing: boolean = !!stream?.active

  return (
    <ScreenshareContext.Provider
      value={{
        //
        stream,
        startScreenCapture,
        stopScreenCapture,
        isScreenSharing,
        startPreview,
        stopPreview,
      }}
    >
      {children}
    </ScreenshareContext.Provider>
  )
}
