/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Config variables
  readonly VITE_API_URL: string
  readonly VITE_STAGE: string
  readonly VITE_API_URL_PUB: string
  readonly VITE_SHARE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_DISCORD_CLIENT_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
