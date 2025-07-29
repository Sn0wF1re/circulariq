<template>
  <div class="min-h-screen bg-[#EFFBF0]">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg">   <!---  bg-[#28A745] -->
              <img src="/logo.png" alt="CircularIQ Logo" class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">CircularIQ</h1>
              <p class="text-sm text-gray-500">Sustainability Compliance Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Example user actions, can be replaced with actual logic -->
            <NuxtLink to="/notifications" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconBell class="w-4 h-4" />
              Notifications
            </NuxtLink>
            <NuxtLink to="/settings" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconSettings class="w-4 h-4" />
              Settings
            </NuxtLink>
            <NuxtLink to="/billing" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconCreditCard class="w-4 h-4" />
              Billing
            </NuxtLink>
            <NuxtLink to="/team" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconUsers class="w-4 h-4" />
              Team
            </NuxtLink>
            <button class="border rounded px-3 py-1 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 font-medium">
              <IconLogOut class="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs Navigation -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Tabs v-model="activeTab" class="space-y-6">
        <div class="grid w-full grid-cols-6 bg-white rounded-t-lg overflow-hidden">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/dashboard' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconBarChart3 class="w-4 h-4" />
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/products' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconPackage class="w-4 h-4" />
            Products
          </NuxtLink>
          <NuxtLink
            to="/reports"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/reports' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconFileText class="w-4 h-4" />
            Reports
          </NuxtLink>
          <NuxtLink
            to="/compliance"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/compliance' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconCheckCircle class="w-4 h-4" />
            Compliance
          </NuxtLink>
          <NuxtLink
            to="/recommendations"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/recommendations' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconTrendingUp class="w-4 h-4" />
            AI Insights
          </NuxtLink>
          <NuxtLink
            to="/upload"
            class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
            :class="route.path === '/upload' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
          >
            <IconUpload class="w-4 h-4" />
            Data Upload
          </NuxtLink>
        </div>
      </Tabs>
    </div>

    <!-- Main Content Slot -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NuxtLink } from '#components'
import { Bell as IconBell, Settings as IconSettings, LogOut as IconLogOut, BarChart3 as IconBarChart3, Package as IconPackage, FileText as IconFileText, CheckCircle as IconCheckCircle, TrendingUp as IconTrendingUp, Upload as IconUpload, CreditCard as IconCreditCard, Users as IconUsers } from 'lucide-vue-next'

const route = useRoute()
// Fix: define activeTab to avoid runtime error
const activeTab = ref(null)
</script>
