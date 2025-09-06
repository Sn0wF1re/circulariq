<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative">
        <IconBell class="w-5 h-5" />
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
          {{ unreadCount }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-96 max-h-96 overflow-y-auto">
      <div class="flex items-center justify-between px-4 py-2 border-b">
        <span class="font-semibold">Notifications</span>
        <Button v-if="unreadCount > 0" variant="outline" size="sm" @click="markAllAsRead">Mark all as read</Button>
      </div>
      <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
        No notifications
      </div>
      <div v-else>
        <div v-for="notif in notifications" :key="notif.id" class="border-b last:border-b-0">
          <Card :class="[!notif.read ? 'bg-blue-50' : 'bg-white']" class="rounded-none shadow-none">
            <CardContent class="flex items-start gap-3 py-3">
              <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
              <div class="flex-1">
                <div class="font-medium">{{ notif.message }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(notif.created_at) }}</div>
              </div>
              <Button v-if="!notif.read" variant="ghost" size="icon" @click="markAsRead(notif.id)">
                <IconCheck class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="deleteNotification(notif.id)">
                <IconTrash class="w-4 h-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="px-4 py-2 border-t text-center">
        <Button variant="link" class="w-full" @click="goToNotifications">
          View all
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell as IconBell, Check as IconCheck, Trash as IconTrash } from 'lucide-vue-next'

const { notifications, markAsRead, deleteNotification, refresh } = useNotifications({ useMock: false })
const router = useRouter()

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

function goToNotifications() {
  router.push('/notifications')
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
