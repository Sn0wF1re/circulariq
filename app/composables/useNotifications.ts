// Composable: useNotifications
// Fetches notifications for a user or company
// Usage: const { notifications, error, loading, refetch } = useNotifications(supabase, { companyId, userId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Notification {
  id: string
  company_id: string
  user_id: string
  type: string
  message: string
  read: boolean
  created_at: string
  updated_at: string
  severity: string
  link: string
  context: any
}

interface UseNotificationsOptions {
  companyId?: string
  userId?: string
  useMock?: boolean
}

type UseNotificationsReturn = {
  notifications: ShallowRef<Notification[]>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: 'n1',
    company_id: 'mock-company',
    user_id: 'user1',
    type: 'info',
    message: 'Welcome to CircularIQ!',
    read: false,
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2025-07-01T10:05:00Z',
    severity: 'info',
    link: '',
    context: null,
  },
  {
    id: 'n2',
    company_id: 'mock-company',
    user_id: 'user2',
    type: 'alert',
    message: 'Your report is ready.',
    read: true,
    created_at: '2025-07-02T12:00:00Z',
    updated_at: '2025-07-02T12:05:00Z',
    severity: 'warning',
    link: '/reports',
    context: { reportId: 'r1' },
  },
]

// Simple in-memory cache by companyId+userId
const notificationsCache = new Map<string, Notification[]>()

export function useNotifications(
  supabase: SupabaseClient,
  options: UseNotificationsOptions
): UseNotificationsReturn {
  const notifications = shallowRef<Notification[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // Should we use mock data? True if explicitly requested or in development mode
  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  function cacheKey() {
    return (options.companyId || '') + ':' + (options.userId || '')
  }

  async function fetchData() {
    // On server, skip fetching unless using mock data
    if (!isClient && !useMock.value) return
    loading.value = true
    error.value = null

    // Use cache if available and not using mock data
    if (!useMock.value && notificationsCache.has(cacheKey())) {
      notifications.value = notificationsCache.get(cacheKey())!
      loading.value = false
      return
    }

    // Use mock data if requested or in dev mode
    if (useMock.value) {
      notifications.value = mockNotifications
      loading.value = false
      return
    }

    let notifData, notifErr
    try {
      let query = supabase
        .from('notifications')
        .select('*')
      if (options.companyId) {
        query = query.eq('company_id', options.companyId)
      }
      if (options.userId) {
        query = query.eq('user_id', options.userId)
      }
      ({ data: notifData, error: notifErr } = await query)
      if (notifErr) throw notifErr
      notifications.value = notifData || []
      notificationsCache.set(cacheKey(), notifications.value)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  watch(() => [options.companyId, options.userId], () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    notifications,
    error,
    loading,
    refetch: fetchData,
  }
}
