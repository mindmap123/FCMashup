/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_USE_MOCK_BACKEND?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
