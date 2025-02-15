import React, { useContext } from 'react'
import axios from 'axios'
import { AuthTypeEnum, MyDiscordGuild } from '@regolithco/common'
import log from 'loglevel'
import { LoginContext, LoginContextWrapper } from '../context/auth.context'
import useLocalStorage from './useLocalStorage'

export type MyLocalStorageGuilds = {
  myGuilds: MyDiscordGuild[]
  lastCheck: number
}

export const useDiscordGuilds = () => {
  const { authType } = useContext(LoginContextWrapper)
  const { token } = useContext(LoginContext)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [cached, setCached] = useLocalStorage<MyLocalStorageGuilds | null>('ROCP_myGuilds', null)

  const fetchGuilds = React.useCallback(async () => {
    if (authType !== AuthTypeEnum.Discord || !token) return
    try {
      log.debug('DISCORD::: Fetching guilds')
      const response = await axios
        .get('https://discord.com/api/v10/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          log.error('Error fetching Discord guilds', error)
          if (error.response?.status === 401) {
            localStorage.removeItem('ROCP_myGuilds')
          }
          throw error
        })
      const guilds = response.data.map((guild: Record<string, string>) => ({
        id: guild.id,
        name: guild.name,
        iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '',
        // In discord permissions, 0x0000000000010000 is the "Read Messages" permission
        // and 0x0000000000100000 is the "Send Messages" permission
        hasPermission:
          (parseInt(guild.permissions) & 0x0000000000010000) === 0x0000000000010000 &&
          (parseInt(guild.permissions) & 0x0000000000100000) === 0x0000000000100000,
      }))
      setCached({
        myGuilds: guilds,
        lastCheck: Date.now(),
      })

      setError(null)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [cached, token, setCached, authType])

  // Automatically do guild load on first load. This should only execute if the user is logged in
  // and the cached value is not stale
  React.useEffect(() => {
    if (authType !== AuthTypeEnum.Discord || !token) return
    // If the data is cached and it's less than a day old then use it
    if (cached && cached.lastCheck && Date.now() - Number(cached.lastCheck) < 5 * 60 * 1000) {
      // setCached({ ...cached, lastCheck: Date.now() })
    } else {
      fetchGuilds()
    }
  }, [authType, token, cached, setCached])

  const hasOneValid = (cached?.myGuilds || []).length > 0 && cached?.myGuilds.some((guild) => guild.hasPermission)

  return {
    isDiscord: authType === AuthTypeEnum.Discord,
    hasOneValid,
    forceRefresh: () => {
      setCached(null)
      setLoading(true)
    },
    myGuilds: cached?.myGuilds || [],
    loading,
    error,
  }
}
