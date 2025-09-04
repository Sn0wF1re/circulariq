import { ref, computed, onMounted } from 'vue'
// composables are auto-imported in Nuxt

// ---- 1. Mock Data ----
const mockNotifications = [
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

export function useNotifications({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const notifications = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchNotifications() {
    if (useMock) {
      notifications.value = mockNotifications
      return
    }
    loading.value = true
    error.value = null
    try {
      // Example: fetch notifications for the current user
      const { data, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.value?.id)
        .order('created_at', { ascending: false })
      if (notifError) throw notifError
      notifications.value = data || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch notifications'
      notifications.value = mockNotifications
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchNotifications)

  const notificationsToShow = computed(() => notifications.value.length ? notifications.value : mockNotifications)

  async function markAsRead(notificationId: string) {
    loading.value = true
    error.value = null
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
      if (updateError) throw updateError
      await fetchNotifications()
    } catch (e: any) {
      error.value = e.message || 'Failed to mark notification as read.'
    } finally {
      loading.value = false
    }
  }

  async function createNotification({ user_id, company_id, type, message, target_type, target_id, meta }: {
    user_id: string,
    company_id?: string,
    type?: string,
    message: string,
    target_type?: string,
    target_id?: string,
    meta?: any
  }) {
    loading.value = true
    error.value = null
    try {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert({
          user_id,
          company_id,
          type,
          message,
          target_type,
          target_id,
          meta,
          read: false
        })
      if (insertError) throw insertError
      await fetchNotifications()
    } catch (e: any) {
      error.value = e.message || 'Failed to create notification.'
    } finally {
      loading.value = false
    }
  }

  async function deleteNotification(notificationId: string) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
      if (deleteError) throw deleteError
      await fetchNotifications()
    } catch (e: any) {
      error.value = e.message || 'Failed to delete notification.'
    } finally {
      loading.value = false
    }
  }

  return {
    notifications: notificationsToShow,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    createNotification,
    deleteNotification
  }
}
