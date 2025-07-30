export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // If not logged in, do nothing (let auth middleware handle it)
  if (!user.value) return

  // Don't run on onboarding page or auth pages
  const authPages = ['/onboarding', '/login', '/signup', '/forgot-password']
  if (authPages.includes(to.path)) return

  // Use composable for onboarding status
  const { onboardingComplete, fetchStatus } = useOnboardingStatus()
  await fetchStatus()
  if (!onboardingComplete.value) {
    return navigateTo('/onboarding')
  }
})
