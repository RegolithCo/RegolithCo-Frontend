import { useSearchParams } from 'react-router-dom'
import qs from 'query-string'
import { useCallback, useMemo, useRef } from 'react'
import { produce } from 'immer'

type QueryValue = string | (string | null)[] | null
type QueryState = Record<string, QueryValue>

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const latestParamsRef = useRef(searchParams.toString())

  // Keep ref up to date
  latestParamsRef.current = searchParams.toString()

  const query = useMemo(() => {
    return qs.parse(latestParamsRef.current, { arrayFormat: 'comma' }) as QueryState
  }, [searchParams])

  const setQuery = useCallback(
    (updates: QueryState) => {
      const current = qs.parse(latestParamsRef.current, { arrayFormat: 'comma' }) as QueryState

      const next = produce(current, (draft) => {
        for (const key in updates) {
          let value = updates[key]
          if (Array.isArray(value)) {
            value = value.filter((v) => v !== '' && v !== null && v !== undefined)
          }

          const isEmpty =
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '') ||
            (Array.isArray(value) && value.length === 0)

          if (isEmpty) {
            delete draft[key]
          } else {
            draft[key] = value
          }
        }
      })

      if (JSON.stringify(current) === JSON.stringify(next)) return

      const newQuery = qs.stringify(next, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
      })

      setSearchParams(new URLSearchParams(newQuery), { replace: true })
    },
    [setSearchParams]
  )

  const setQueryValue = useCallback(
    (key: string, value: QueryValue) => {
      setQuery({ [key]: value })
    },
    [setQuery]
  )

  const resetQueryValues = useCallback(
    (keys?: string[]) => {
      if (!keys || keys.length === 0) {
        setSearchParams(new URLSearchParams(), { replace: true })
        return
      }
      const filteredParams = Object.fromEntries(Object.entries(query).filter(([k]) => !keys.includes(k)))
      setSearchParams(
        new URLSearchParams(
          qs.stringify(filteredParams, { arrayFormat: 'comma', skipNull: true, skipEmptyString: true })
        )
      )
    },
    [setSearchParams]
  )

  return { query, setQuery, setQueryValue, resetQueryValues }
}

type Parser<T> = (value: string | null) => T | null
type Serializer<T> = (value: T) => string | null

export function useURLState<T>(
  urlKey: string,
  initialValue: T,
  serializer: Serializer<T> = (value) => value as unknown as string | null,
  parser: Parser<T> = (value) => value as T
) {
  const { query, setQueryValue } = useQueryParams()

  const value: T = query[urlKey] ? (parser(query[urlKey] as string | null) as T) : initialValue

  // Allow setValue to accept either a value or an updater function
  const setValue = (newValue: T | ((prev: T) => T)) => {
    const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value as T) : newValue
    const serializedValue = serializer(nextValue)
    if (serializedValue === null || serializedValue === undefined) {
      setQueryValue(urlKey, null)
    } else {
      setQueryValue(urlKey, serializedValue)
    }
  }

  return [value, setValue] as const
}

export function useURLArrayState<T>(
  key: string,
  initialValue: T[] = [],
  serializer: Serializer<T> = (value) => value as unknown as string | null,
  parser: Parser<T> = (value) => value as T | null
) {
  const { query, setQueryValue } = useQueryParams()

  // Sort the default value to ensure consistent order
  initialValue = useMemo(() => initialValue.sort(), [initialValue])

  const value: T[] = (
    query[key]
      ? Array.isArray(query[key])
        ? query[key].map(parser)
        : [parser(query[key] as string | null)]
      : initialValue
  ).filter((v) => v !== undefined && v !== null)

  const setValue = (newValue: T[] | ((prev: T[]) => T[])) => {
    const nextValue = typeof newValue === 'function' ? (newValue as (prev: T[]) => T[])(value) : newValue
    // Sort the next value to ensure consistent order
    nextValue.sort()

    // Do a deep comparison to check if the value has changed
    const isDefault = nextValue.length === initialValue.length && nextValue.every((v, i) => v === initialValue[i])

    const serializedValue = isDefault ? null : nextValue.filter((v) => v !== undefined && v !== null).map(serializer)
    setQueryValue(key, serializedValue)
  }

  return [value, setValue] as const
}
