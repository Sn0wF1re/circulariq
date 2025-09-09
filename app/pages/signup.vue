<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EFFBF0] px-2 overflow-y-auto">
    <Card class="w-full max-w-sm md:max-w-lg md:min-w-[350px] p-4 md:p-8 shadow-lg bg-white rounded-xl">
      <CardHeader class="mb-6 text-center">
        <IconUserPlus class="mx-auto w-10 h-10 text-[#28A745] mb-2" />
        <CardTitle class="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription class="text-gray-600">Create your CircularIQ account</CardDescription>
      </CardHeader>
  <form @submit.prevent="onSignup" class="flex flex-col gap-2 md:gap-5">
        <!-- First and last name fields removed; handled in onboarding -->
        <div class="flex flex-col gap-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="you@email.com" required autofocus />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="confirm">Confirm Password</Label>
          <Input id="confirm" v-model="confirm" type="password" placeholder="••••••••" required />
        </div>
  <Button type="submit" :disabled="loading" class="w-full h-12 bg-[#28A745] hover:bg-[#14532D] text-white font-semibold text-base rounded">
          <span v-if="loading"><IconLoader class="animate-spin w-4 h-4 inline mr-2" /></span>
          Sign Up
        </Button>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      </form>
      <div class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-[#28A745] hover:underline font-medium">Sign in</NuxtLink>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserPlus as IconUserPlus, Loader as IconLoader } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

// First and last name handled in onboarding
const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const supabase = useSupabaseClient()

async function onSignup() {
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  error.value = ''
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (signUpError) {
    error.value = signUpError.message || 'Sign up failed.'
    return
  }
  // After signup, ask user to verify email
  router.push('/verify-email')
}
</script>

<style scoped>
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>
