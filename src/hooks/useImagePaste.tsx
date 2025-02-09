import { useCallback, useEffect, useRef } from 'react'
import log from 'loglevel'

export const useImagePaste = (onImage: (image: string) => void, disabled?: boolean) => {
  const disabledRef = useRef<boolean>(!!disabled)

  // Update the ref whenever the `disabled` prop changes
  useEffect(() => {
    disabledRef.current = !!disabled
  }, [disabled])

  // Handle the paste event
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (disabledRef.current || !event.clipboardData) {
        // log.debug('useImagePaste: DISABLED')
        return
      }
      const clipboardItems = Array.from(event.clipboardData.items)

      // Loop through clipboard items to find an image
      for (const item of clipboardItems) {
        if (item.type.startsWith('image')) {
          try {
            const blob = item.getAsFile()
            if (blob) {
              const reader = new FileReader()
              reader.onload = (event) => {
                const base64Url = event.target?.result as string
                // log.debug('useImagePaste: SUCCEEDED')
                onImage(base64Url) // Display the base64-encoded image preview
              }
              reader.readAsDataURL(blob)
            }
            break
          } catch (e) {
            console.error('Error: Unable to paste image', e)
          }
        } else {
          // log.debug(' useImagePaste: NO IMAGE')
        }
      }
    },
    [onImage]
  )

  // Now set up a watcher for the containerRef if it exists
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])
}
