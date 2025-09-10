<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EFFBF0] px-2 overflow-y-auto">
    <Card class="w-full max-w-sm md:max-w-lg md:min-w-[350px] p-4 md:p-8 shadow-lg bg-white rounded-xl">
      <CardHeader class="mb-6 text-center">
        <IconKey class="mx-auto w-10 h-10 text-[#28A745] mb-2" />
        <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription class="text-gray-600">We'll send you a link to reset your password</CardDescription>
      </CardHeader>
      <form @submit.prevent="onReset" class="flex flex-col gap-2 md:gap-5">
        <div class="flex flex-col gap-1">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="you@email.com" required autofocus />
        </div>
        <Button type="submit" :disabled="loading" class="w-full h-12 bg-[#28A745] hover:bg-[#14532D] text-white font-semibold text-base rounded">
          <span v-if="loading"><IconLoader class="animate-spin w-4 h-4 inline mr-2" /></span>
          Send Reset Link
        </Button>
        <div v-if="message" class="text-green-700 text-sm text-center">{{ message }}</div>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      </form>
      <div class="mt-6 text-center text-sm text-gray-600">
        <NuxtLink to="/login" class="text-[#28A745] hover:underline font-medium">Back to sign in</NuxtLink>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Key as IconKey, Loader as IconLoader } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const email = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')
const supabase = useSupabaseClient()

async function onReset() {
  loading.value = true
  error.value = ''
  message.value = ''
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value)
  loading.value = false
  if (resetError) {
    error.value = resetError.message || 'Failed to send reset link.'
    return
  }
  message.value = 'Check your email for a password reset link.'
}
</script>

<style scoped>
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>
