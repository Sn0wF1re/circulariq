// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
// import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt', '@nuxtjs/supabase'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
  },
  alias: {
    '@components': fileURLToPath(new URL('./app/components', import.meta.url))
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    }
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/onboarding',
      exclude: [
        '/signup',
        '/verify-email',
        '/forgot-password',
        '/onboarding',
        '/billing',
        '/settings',
        '/team',
        '/dashboard',
        '/compliance',
        '/notifications',
        '/products',
        '/recommendations',
        '/reports',
        '/upload'
      ]
    }
  }
})