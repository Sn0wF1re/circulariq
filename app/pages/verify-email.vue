<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EFFBF0]">
    <Card class="w-full max-w-lg min-w-[350px] p-8 shadow-lg bg-white rounded-xl">
      <CardHeader class="mb-6 text-center">
        <IconMailCheck class="mx-auto w-10 h-10 text-[#28A745] mb-2" />
        <CardTitle class="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription class="text-gray-600">Check your email and click the verification link to activate your account.</CardDescription>
      </CardHeader>
      <div class="text-center text-gray-700 mb-4">
        Once verified, please log in to continue onboarding.
      </div>
      <NuxtLink to="/login" class="w-full block mt-4">
        <Button type="submit" class="w-full bg-[#28A745] hover:bg-[#14532D]">Go to Login</Button>
      </NuxtLink>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { MailCheck as IconMailCheck } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })
</script>

<style scoped>
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>
