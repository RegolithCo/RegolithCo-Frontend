export type MakeSessionUrlInput = { sessionId?: string; orderId?: string; scoutingFindId?: string; tab?: string }

export const makeSessionUrls = ({ scoutingFindId, orderId, tab, sessionId }: MakeSessionUrlInput) => {
  if (orderId && scoutingFindId) throw new Error('Cannot have both orderId and scoutingFindId')

  if (!sessionId) return '/session'
  else if (orderId) return `/session/${sessionId}/${tab || 'dash'}/w/${orderId}`
  else if (scoutingFindId) return `/session/${sessionId}/${tab || 'dash'}/s/${scoutingFindId}`
  else return `/session/${sessionId}/${tab || 'dash'}`
}
