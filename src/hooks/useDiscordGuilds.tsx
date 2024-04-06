import React from 'react'
import axios from 'axios'
import { useOAuth2 } from './useOAuth2'
import { AuthTypeEnum, MyDiscordGuild } from '@regolithco/common'

export const useDiscordGuilds = () => {
  const { authType, token } = useOAuth2()
  const [myGuilds, setMyGuilds] = React.useState<MyDiscordGuild[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (authType !== AuthTypeEnum.DISCORD || !token) return

    const fetchGuilds = async () => {
      try {
        const cachedData = localStorage.getItem('myGuilds')
        const cachedTime = localStorage.getItem('myGuildsTime')

        // If the data is cached and it's less than 5 minutes old, use it
        if (cachedData && cachedTime && Date.now() - Number(cachedTime) < 5 * 60 * 1000) {
          setMyGuilds(JSON.parse(cachedData))
        } else {
          const response = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const guilds = response.data.map((guild: Record<string, string>) => ({
            id: guild.id,
            name: guild.name,
            iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : '',
            hasPermission:
              (parseInt(guild.permissions) & 0x0000000000010000) === 0x0000000000010000 &&
              (parseInt(guild.permissions) & 0x0000000000100000) === 0x0000000000100000,
          }))
          setMyGuilds(guilds)
          localStorage.setItem('myGuilds', JSON.stringify(guilds))
          localStorage.setItem('myGuildsTime', Date.now().toString())
        }
        setError(null)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuilds()
  }, [authType, token])

  const hasOneValid = myGuilds.length > 0 && myGuilds.some((guild) => guild.hasPermission)

  return { myGuilds, loading, error, isDiscord: authType === AuthTypeEnum.DISCORD, hasOneValid }
}
