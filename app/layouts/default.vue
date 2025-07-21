<template>
  <div class="min-h-screen bg-[#EFFBF0]">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-10 h-10 bg-[#28A745] rounded-lg">
              <img src="/logo.png" alt="CircularIQ Logo" class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">CircularIQ</h1>
              <p class="text-sm text-gray-500">Sustainability Compliance Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Example user actions, can be replaced with actual logic -->
            <button class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconBell class="w-4 h-4" />
              Notifications
            </button>
            <button class="border rounded px-3 py-1 flex items-center gap-2 text-gray-700 hover:bg-gray-100 font-medium">
              <IconSettings class="w-4 h-4" />
              Settings
            </button>
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
        <TabsList class="grid w-full grid-cols-6 bg-white">
          <TabsTrigger value="dashboard" class="flex items-center gap-2">
            <IconBarChart3 class="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" class="flex items-center gap-2">
            <IconPackage class="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="reports" class="flex items-center gap-2">
            <IconFileText class="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="compliance" class="flex items-center gap-2">
            <IconCheckCircle class="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="recommendations" class="flex items-center gap-2">
            <IconTrendingUp class="w-4 h-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="upload" class="flex items-center gap-2">
            <IconUpload class="w-4 h-4" />
            Data Upload
          </TabsTrigger>
        </TabsList>
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
import { Bell as IconBell, Settings as IconSettings, LogOut as IconLogOut, BarChart3 as IconBarChart3, Package as IconPackage, FileText as IconFileText, CheckCircle as IconCheckCircle, TrendingUp as IconTrendingUp, Upload as IconUpload } from 'lucide-vue-next'

const activeTab = ref('dashboard')
</script>
