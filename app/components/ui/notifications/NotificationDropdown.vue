<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative p-2 md:p-0">
        <IconBell class="w-7 h-7 md:w-5 md:h-5" />
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
          {{ unreadCount }}
        </span>
      </Button>
    </DropdownMenuTrigger>
  <DropdownMenuContent class="w-full max-w-xs mx-auto md:w-96 md:max-w-96 max-h-80 md:max-h-96 overflow-y-auto p-0">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-b gap-2">
        <span class="font-semibold text-base">Notifications</span>
        <Button v-if="unreadCount > 0" variant="outline" size="sm" class="w-full md:w-auto" @click="markAllAsRead">Mark all as read</Button>
      </div>
      <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 text-base">
        No notifications
      </div>
      <div v-else>
        <div v-for="notif in notifications" :key="notif.id" class="border-b last:border-b-0">
          <Card :class="[!notif.read ? 'bg-blue-50' : 'bg-white']" class="rounded-none shadow-none">
            <CardContent class="flex flex-col md:flex-row md:items-start gap-3 py-3 px-3">
              <div class="flex items-center gap-2">
                <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-blue-500"></span>
                <div class="flex-1">
                  <div class="font-medium text-base">{{ notif.message }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(notif.created_at) }}</div>
                </div>
              </div>
              <div class="flex gap-2 mt-2 md:mt-0">
                <Button v-if="!notif.read" variant="ghost" size="icon" class="w-10 h-10" @click="markAsRead(notif.id)">
                  <IconCheck class="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" class="w-10 h-10" @click="deleteNotification(notif.id)">
                  <IconTrash class="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="px-4 py-3 border-t text-center">
        <Button variant="link" class="w-full text-base" @click="goToNotifications">
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
