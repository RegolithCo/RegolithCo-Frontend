/**
 *
 * @param data
 * @param finalFileName
 * @param fileType
 */
export const downloadFile = (data: string, finalFileName: string, fileType: string) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType })
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement('a')
  a.download = finalFileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

/**
 *
 */
export const wipeAuthStorage = () => {
  deleteKeysWithPrefix('ROCP_')
  deleteKeysWithPrefix('PKCE_')
  localStorage.removeItem('redirect_url')
}

/**
 *
 */
export const wipeLocalLookups = () => {
  // Wipe all local storage keys that start with 'LookupData:'
  // This should refresh all the lookups and price data
  deleteKeysWithPrefix('LookupData:')

  // Now remove all the Survey Corps data
  deleteKeysWithPrefix('SurveyData:')
}

export const deleteKeysWithPrefix = (prefix: string) => {
  const keys = fetchLocalStorageKeys(prefix)
  keys.forEach((key) => {
    localStorage.removeItem(key)
  })
}

export const fetchLocalStorageKeys = (prefix: string) => {
  const items: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      items.push(key)
    }
  }

  return items
}
