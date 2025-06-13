import React from 'react'
import { useLocation } from 'react-router-dom'

const DEFAULT_TITLE = 'Regolith Co. - Star Citizen Mining Tool'

export const useBrowserTitle = (title?: string) => {
  const location = useLocation() // THIS IS WHY THIS COMPONENT MUST BE INSIDE THE ROUTER
  // Set the browser's title to the project name
  React.useEffect(() => {
    if (title) {
      if (title !== document.title) document.title = `Regolith: ${title}`
    } else {
      if (document.title !== DEFAULT_TITLE)
        // If no title is provided, set the default title
        document.title = DEFAULT_TITLE
    }
  }, [title, location])
}
