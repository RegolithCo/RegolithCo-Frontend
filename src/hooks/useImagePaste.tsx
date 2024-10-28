import { useEffect } from 'react'

export const useImagePaste = (onImage: (image: string) => void) => {
  // Handle the paste event
  const handlePaste = (event) => {
    const clipboardItems = event.clipboardData.items

    // Loop through clipboard items to find an image
    for (const item of clipboardItems) {
      if (item.type.startsWith('image')) {
        try {
          const blob = item.getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              const base64Url = event.target?.result as string
              onImage(base64Url) // Display the base64-encoded image preview
            }
            reader.readAsDataURL(blob)
          }
          break
        } catch (e) {
          console.error('Error: Unable to paste image', e)
        }
      }
    }
  }

  // Now set up a watcher for the containerRef if it exists
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])
}
