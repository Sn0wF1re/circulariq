// Composable: useUploads
// Fetches uploads for a company
// Usage: const { uploads, error, loading, refetch } = useUploads(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Upload {
  id: string
  company_id: string
  filename: string
  upload_type: string
  parse_status: string
  error_summary: any
  created_at: string
  updated_at: string
  file_size: number
  file_type: string
  storage_path: string
  user_id: string
  original_filename: string
  checksum: string
}

interface UseUploadsOptions {
  companyId: string
  useMock?: boolean
}

type UseUploadsReturn = {
  uploads: ShallowRef<Upload[]>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockUploads: Upload[] = [
  {
    id: 'u1',
    company_id: 'mock-company',
    filename: 'mock1.csv',
    upload_type: 'products',
    parse_status: 'success',
    error_summary: null,
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2025-07-01T10:05:00Z',
    file_size: 12345,
    file_type: 'text/csv',
    storage_path: '/uploads/mock1.csv',
    user_id: 'user1',
    original_filename: 'original_mock1.csv',
    checksum: 'abc123',
  },
  {
    id: 'u2',
    company_id: 'mock-company',
    filename: 'mock2.csv',
    upload_type: 'reports',
    parse_status: 'error',
    error_summary: { line: 3, message: 'Invalid format' },
    created_at: '2025-07-02T12:00:00Z',
    updated_at: '2025-07-02T12:05:00Z',
    file_size: 67890,
    file_type: 'text/csv',
    storage_path: '/uploads/mock2.csv',
    user_id: 'user2',
    original_filename: 'original_mock2.csv',
    checksum: 'def456',
  },
]

// Simple in-memory cache by companyId
const uploadsCache = new Map<string, Upload[]>()

export function useUploads(
  supabase: SupabaseClient,
  options: UseUploadsOptions
): UseUploadsReturn {
  const uploads = shallowRef<Upload[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    error.value = null

    // Caching
    if (!useMock.value && uploadsCache.has(options.companyId)) {
      uploads.value = uploadsCache.get(options.companyId)!
      loading.value = false
      return
    }

    if (useMock.value) {
      uploads.value = mockUploads
      loading.value = false
      return
    }

    let uploadData, uploadErr
    try {
      ({ data: uploadData, error: uploadErr } = await supabase
        .from('uploads')
        .select('*')
        .eq('company_id', options.companyId))
      if (uploadErr) throw uploadErr
      uploads.value = uploadData || []
      uploadsCache.set(options.companyId, uploads.value)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  watch(() => options.companyId, () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    uploads,
    error,
    loading,
    refetch: fetchData,
  }
}
