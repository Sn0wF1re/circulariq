<script setup lang="ts">
import { useSupabaseClient } from '#imports'
import { useNotifications } from '~/app/composables/useNotifications'

const supabase = useSupabaseClient()
const companyId = 'company-1' // TODO: Replace with actual logic
const userId = 'user-1' // TODO: Replace with actual logic

const { notifications, error, loading, refetch } = useNotifications(supabase, { companyId, userId })
</script>
<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-bold">Notifications</h2>
      <p class="text-gray-600">Manage your alerts and notification preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Notifications -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest updates and alerts from your account</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <template v-for="(notification, i) in notificationsToShow" :key="i">
            <div
              class="flex items-start space-x-3 p-4 rounded-lg"
              :class="notification.bg"
            >
              <div :class="['w-2 h-2 rounded-full mt-2 flex-shrink-0', notification.dot]"></div>
              <div class="flex-1">
                <p class="font-medium">{{ notification.title }}</p>
                <p class="text-sm text-gray-600">{{ notification.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
              </div>
              <Button v-if="notification.action" variant="outline" size="sm">{{ notification.action }}</Button>
            </div>
          </template>
        </CardContent>
      </Card>

      <!-- Notification Settings -->
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label for="compliance-alerts">Compliance Alerts</Label>
              <input type="checkbox" id="compliance-alerts" class="rounded" checked />
            </div>
            <div class="flex items-center justify-between">
              <Label for="report-ready">Report Ready</Label>
              <input type="checkbox" id="report-ready" class="rounded" checked />
            </div>
            <div class="flex items-center justify-between">
              <Label for="regulation-updates">Regulation Updates</Label>
              <input type="checkbox" id="regulation-updates" class="rounded" checked />
            </div>
            <div class="flex items-center justify-between">
              <Label for="ai-recommendations">AI Recommendations</Label>
              <input type="checkbox" id="ai-recommendations" class="rounded" />
            </div>
            <div class="flex items-center justify-between">
              <Label for="weekly-digest">Weekly Digest</Label>
              <input type="checkbox" id="weekly-digest" class="rounded" checked />
            </div>
          </div>
          <Separator />
          <div class="space-y-3">
            <h4 class="font-medium">Notification Method</h4>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <input type="radio" name="notification-method" value="email" checked />
                <Label>Email notifications</Label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="radio" name="notification-method" value="sms" />
                <Label>SMS notifications</Label>
              </div>
              <div class="flex items-center space-x-2">
                <input type="radio" name="notification-method" value="both" />
                <Label>Both email and SMS</Label>
              </div>
            </div>
          </div>
          <Button class="w-full bg-[#28A745] hover:bg-[#14532D]">Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Placeholder notifications
const placeholderNotifications = [
  {
    title: 'New EU Regulation Update',
    description: 'Extended Producer Responsibility regulations have been updated for Q2 2024',
    time: '2 hours ago',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
  },
  {
    title: 'Compliance Score Improved',
    description: 'Your overall compliance score has increased to 87% (+2%)',
    time: '1 day ago',
    bg: 'bg-green-50',
    dot: 'bg-green-500',
  },
  {
    title: 'Report Generation Complete',
    description: 'Your Q1 2024 sustainability report is ready for download',
    time: '2 days ago',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-500',
  },
  {
    title: 'Action Required',
    description: 'Product BFC-002 requires updated recycling data to maintain compliance',
    time: '3 days ago',
    bg: 'bg-red-50',
    dot: 'bg-red-500',
    action: 'View',
  },
]

// This would be replaced by real data from an API or composable
const notifications = ref(null)

const notificationsToShow = computed(() => notifications.value && notifications.value.length > 0 ? notifications.value : placeholderNotifications)
</script>
