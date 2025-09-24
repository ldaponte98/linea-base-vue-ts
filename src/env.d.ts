/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string
  readonly VITE_AZURE_REDIRECT_URI: string
  readonly VITE_API_BASE_URL: string
  // ... otras variables de entorno
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}