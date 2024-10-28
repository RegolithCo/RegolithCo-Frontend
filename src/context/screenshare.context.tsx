import React, { createContext, useContext, useState, useEffect, useRef, PropsWithChildren } from 'react'

export interface ScreenshareContextType {
  stream: MediaStream | null
  videoRef?: React.RefObject<HTMLVideoElement>
  startScreenCapture: () => Promise<void>
  stopScreenCapture: () => void
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
  isScreenSharing: false,
})

export const ScreenshareProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'application', // Prompts the user to share a window
          frameRate: { ideal: 2, max: 5 },
          volume: 0,
        },
      })
      setStream(stream)
    } catch (err) {
      console.error('Error: Unable to capture screen', err)
    }
  }

  const stopScreenCapture = () => {
    if (stream) {
      // Stop all tracks in the stream
      stream.getTracks().forEach((track) => {
        track.stop()
        track.enabled = false // Ensure the track is disabled
      })

      // Release the stream
      setStream(null)

      // Clean up the video element if necessary
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }
  }, [stream])

  const isScreenSharing = stream?.getTracks().some((track) => track.readyState === 'live') ?? false

  return (
    <ScreenshareContext.Provider
      value={{
        //
        stream,
        startScreenCapture,
        stopScreenCapture,
        isScreenSharing,
        videoRef,
      }}
    >
      {children}
    </ScreenshareContext.Provider>
  )
}
