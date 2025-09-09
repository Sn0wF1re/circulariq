<template>
  <div class="min-h-screen bg-[#EFFBF0]">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Desktop Header -->
        <div class="hidden md:flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg">
              <img src="/logo.png" alt="CircularIQ Logo" class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">CircularIQ</h1>
              <p class="text-sm text-gray-500">Sustainability Compliance Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <NotificationDropdown />
            <NuxtLink to="/settings" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconSettings class="w-4 h-4" /> Settings
            </NuxtLink>
            <NuxtLink to="/billing" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconCreditCard class="w-4 h-4" /> Billing
            </NuxtLink>
            <NuxtLink to="/team" class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconUsers class="w-4 h-4" /> Team
            </NuxtLink>
            <button class="border rounded px-3 py-1 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 font-medium" @click="handleLogout">
              <IconLogOut class="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        <!-- Mobile Header -->
        <div class="md:hidden flex flex-col py-2">
          <div class="flex items-center w-full relative" style="min-height:56px;">
            <!-- Left: Logo and Title only -->
            <div class="flex flex-col items-start gap-0 flex-1">
              <img src="/logo.png" alt="CircularIQ Logo" class="w-7 h-7 mb-1" />
              <span class="font-bold text-base text-gray-900 leading-tight">CircularIQ</span>
            </div>
            <!-- Right: Notification, Hamburger (absolutely right-aligned) -->
            <div class="flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <NotificationDropdown />
              <Sheet v-slot="{ open, close }">
                <SheetTrigger as-child>
                  <button class="p-2 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" class="w-64 flex flex-col items-stretch px-4 pt-4 pb-6">
                  <!-- Subtitle aligned with menu items -->
                  <div class="flex flex-col gap-3 w-full mt-6">
                    <span class="text-xs text-gray-500 py-2 px-2 rounded-lg">Sustainability Compliance Platform</span>
                    <NuxtLink to="/settings" class="flex items-center gap-2 text-gray-700 hover:text-green-700 w-full py-2 px-2 rounded-lg" @click="close">
                      <IconSettings class="w-4 h-4" /> Settings
                    </NuxtLink>
                    <NuxtLink to="/billing" class="flex items-center gap-2 text-gray-700 hover:text-green-700 w-full py-2 px-2 rounded-lg" @click="close">
                      <IconCreditCard class="w-4 h-4" /> Billing
                    </NuxtLink>
                    <NuxtLink to="/team" class="flex items-center gap-2 text-gray-700 hover:text-green-700 w-full py-2 px-2 rounded-lg" @click="close">
                      <IconUsers class="w-4 h-4" /> Team
                    </NuxtLink>
                    <button class="flex items-center gap-2 text-red-600 hover:text-red-800 w-full py-2 px-2 rounded-lg" @click="handleLogout; close()">
                      <IconLogOut class="w-4 h-4" /> Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs Navigation -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Desktop Tabs -->
      <div class="hidden md:grid grid-cols-6 w-full bg-white rounded-t-lg overflow-hidden">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/dashboard' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconBarChart3 class="w-4 h-4" /> Dashboard
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/products' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconPackage class="w-4 h-4" /> Products
        </NuxtLink>
        <NuxtLink
          to="/reports"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/reports' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconFileText class="w-4 h-4" /> Reports
        </NuxtLink>
        <NuxtLink
          to="/compliance"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/compliance' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconCheckCircle class="w-4 h-4" /> Compliance
        </NuxtLink>
        <NuxtLink
          to="/recommendations"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/recommendations' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconTrendingUp class="w-4 h-4" /> AI Insights
        </NuxtLink>
        <NuxtLink
          to="/upload"
          class="flex items-center gap-2 px-4 py-2 transition-colors justify-center text-sm font-medium border-b-2 border-transparent"
          :class="route.path === '/upload' ? 'bg-[#28A745] text-white border-[#28A745]' : 'hover:bg-gray-50 text-gray-900'"
        >
          <IconUpload class="w-4 h-4" /> Data Upload
        </NuxtLink>
      </div>
      <!-- Mobile Dropdown Tabs -->
      <div class="md:hidden w-full">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white text-gray-700">
              <span>
                <template v-if="route.path === '/dashboard'"><IconBarChart3 class="w-4 h-4 mr-2" /> Dashboard</template>
                <template v-else-if="route.path === '/products'"><IconPackage class="w-4 h-4 mr-2" /> Products</template>
                <template v-else-if="route.path === '/reports'"><IconFileText class="w-4 h-4 mr-2" /> Reports</template>
                <template v-else-if="route.path === '/compliance'"><IconCheckCircle class="w-4 h-4 mr-2" /> Compliance</template>
                <template v-else-if="route.path === '/recommendations'"><IconTrendingUp class="w-4 h-4 mr-2" /> AI Insights</template>
                <template v-else-if="route.path === '/upload'"><IconUpload class="w-4 h-4 mr-2" /> Data Upload</template>
                <template v-else>Choose Tab</template>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-full">
            <DropdownMenuItem @click="router.push('/dashboard')" :class="{ 'bg-green-100 font-bold': route.path === '/dashboard' }">
              <IconBarChart3 class="w-4 h-4 mr-2" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/products')" :class="{ 'bg-green-100 font-bold': route.path === '/products' }">
              <IconPackage class="w-4 h-4 mr-2" /> Products
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/reports')" :class="{ 'bg-green-100 font-bold': route.path === '/reports' }">
              <IconFileText class="w-4 h-4 mr-2" /> Reports
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/compliance')" :class="{ 'bg-green-100 font-bold': route.path === '/compliance' }">
              <IconCheckCircle class="w-4 h-4 mr-2" /> Compliance
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/recommendations')" :class="{ 'bg-green-100 font-bold': route.path === '/recommendations' }">
              <IconTrendingUp class="w-4 h-4 mr-2" /> AI Insights
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/upload')" :class="{ 'bg-green-100 font-bold': route.path === '/upload' }">
              <IconUpload class="w-4 h-4 mr-2" /> Data Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
import { Bell as IconBell, Settings as IconSettings, LogOut as IconLogOut, BarChart3 as IconBarChart3, Package as IconPackage, FileText as IconFileText, CheckCircle as IconCheckCircle, TrendingUp as IconTrendingUp, Upload as IconUpload, CreditCard as IconCreditCard, Users as IconUsers } from 'lucide-vue-next'

const route = useRoute()
// Fix: define activeTab to avoid runtime error
const router = useRouter()
const supabase = useSupabaseClient()
const activeTab = ref(null)

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/login')
}

</script>
