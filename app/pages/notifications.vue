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
          <Button v-if="unreadCount > 0" variant="outline" size="sm" @click="markAllAsRead">Mark all as read</Button>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
            No notifications
          </div>
          <template v-else v-for="notif in notifications" :key="notif.id">
            <div
              class="flex items-start space-x-3 p-4 rounded-lg"
              :class="[!notif.read ? 'bg-blue-50' : 'bg-white']"
            >
              <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
              <div class="flex-1">
                <p class="font-medium">{{ notif.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(notif.created_at) }}</p>
              </div>
              <Button v-if="!notif.read" variant="ghost" size="icon" @click="markAsRead(notif.id)">
                <IconCheck class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="deleteNotification(notif.id)">
                <IconTrash class="w-4 h-4 text-red-500" />
              </Button>
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
import { computed } from 'vue'
import { Check as IconCheck, Trash as IconTrash } from 'lucide-vue-next'
const { notifications, markAsRead, deleteNotification, refresh } = useNotifications()
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return date.toLocaleDateString()
}

async function markAllAsRead() {
  for (const notif of notifications.value.filter(n => !n.read)) {
    await markAsRead(notif.id)
  }
  await refresh()
}
</script>
