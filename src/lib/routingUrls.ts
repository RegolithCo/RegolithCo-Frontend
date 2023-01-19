export type MakeSessionUrlInput = { sessionId?: string; orderId?: string; scoutingFindId?: string }

export const makeSessionUrls = ({ scoutingFindId, orderId, sessionId }: MakeSessionUrlInput) => {
  if (orderId && scoutingFindId) throw new Error('Cannot have both orderId and scoutingFindId')

  if (!sessionId) return '/session'
  else if (orderId) return `/session/${sessionId}/w/${orderId}`
  else if (scoutingFindId) return `/session/${sessionId}/s/${scoutingFindId}`
  else return `/session/${sessionId}`
}
