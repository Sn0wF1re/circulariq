<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EFFBF0] px-2">
    <Card class="w-full max-w-xs md:max-w-lg md:min-w-[350px] p-4 md:p-8 shadow-lg bg-white rounded-xl">
      <CardHeader class="mb-6 text-center">
        <IconLock class="mx-auto w-10 h-10 text-[#28A745] mb-2" />
        <CardTitle class="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription class="text-gray-600">Access your CircularIQ dashboard</CardDescription>
      </CardHeader>
  <form @submit.prevent="onLogin" class="flex flex-col gap-2 md:gap-5">
        <div class="flex flex-col gap-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="you@email.com" required autofocus />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember" type="checkbox" class="rounded border-gray-300 mr-2" v-model="remember" />
            <Label for="remember" class="text-sm">Remember me</Label>
          </div>
          <NuxtLink to="/forgot-password" class="text-sm text-[#28A745] hover:underline">Forgot password?</NuxtLink>
        </div>
  <Button type="submit" :disabled="loading" class="w-full h-12 bg-[#28A745] hover:bg-[#14532D] text-white font-semibold text-base rounded">
          <span v-if="loading"><IconLoader class="animate-spin w-4 h-4 inline mr-2" /></span>
          Sign In
        </Button>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      </form>
      <div class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/signup" class="text-[#28A745] hover:underline font-medium">Sign up</NuxtLink>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock as IconLock, Loader as IconLoader } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()
const supabase = useSupabaseClient()

async function onLogin() {
  loading.value = true
  error.value = ''
  const { data: userData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false

  if (authError) {
    error.value = authError.message || 'Login failed.'
    return
  }

  if (!userData.user.user_metadata.onboarding_complete) {
    router.push('/onboarding')  
  }
  router.push('/dashboard')
}
</script>

<style scoped>
/* Extra polish for card shadow and focus states */
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>
