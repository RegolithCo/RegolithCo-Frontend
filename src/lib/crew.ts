import { SessionUser } from '@regolithco/common'

type CrewHierarchy = Record<string, string[]>

/**
 * Turn a flat list of session users into a hierarchy of captains and crew
 * the return values are all userIds.
 * @param sessionUsers
 * @returns
 */
export const crewCalc = (sessionUsers: SessionUser[]): CrewHierarchy => {
  // First find the captains
  const captains: SessionUser[] = sessionUsers.filter((su) => su.pilotSCName !== null)
  const crew: SessionUser[] = sessionUsers.filter((su) => su.pilotSCName === null)

  return captains.reduce((acc, su) => {
    acc[su.ownerId] = crew.filter((c) => c.pilotSCName === su.pilotSCName).map((c) => c.ownerId)
    return acc
  }, {} as CrewHierarchy)
}
