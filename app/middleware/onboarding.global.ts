export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // If not logged in, do nothing (let auth middleware handle it)
  if (!user.value) return

  // Don't run on onboarding page or auth pages
  // const authPages = ['/onboarding', '/login', '/signup', '/forgot-password', '/verify-email']
  const authPages = [
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
  if (authPages.includes(to.path)) return

  // Use composable for onboarding status
  const { onboardingComplete, fetchStatus } = useOnboardingStatus()
  await fetchStatus()
  if (!onboardingComplete.value) {
    return navigateTo('/onboarding')
  }
})
