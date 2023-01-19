import { UserProfile } from '@orgminer/common'

export type Config = {
  authDomain: string
  userPool: string
  apiUrl: string
  userPoolClientId: string
}

export interface LoginContextObj {
  isAuthenticated: boolean
  isInitialized: boolean
  APIWorking?: boolean
  maintenanceMode?: string
  isVerified: boolean
  loading: boolean
  error?: Error
  signIn: () => void
  signOut: () => Promise<void>
  userProfile?: UserProfile
}
