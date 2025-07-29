import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockUploadHistory = [
  {
    id: '1',
    filename: 'products_q1_2024.csv',
    status: 'Processed',
    uploaded_at: '2 hours ago',
  },
  {
    id: '2',
    filename: 'sustainability_metrics.xlsx',
    status: 'Processing',
    uploaded_at: '1 day ago',
  },
  {
    id: '3',
    filename: 'compliance_data.csv',
    status: 'Error',
    uploaded_at: '3 days ago',
  },
]

export function useUploads({ useMock = false, companyId = null } = {}) {
  const supabase = useSupabaseClient()
  const uploadHistory = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUploads() {
    if (useMock) {
      uploadHistory.value = mockUploadHistory
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: uploadError } = await supabase
        .from('uploads')
        .select('*')
        .eq('company_id', companyId)
      if (uploadError) throw uploadError
      uploadHistory.value = data || mockUploadHistory
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch uploads.'
      uploadHistory.value = mockUploadHistory
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(file: File) {
    loading.value = true
    error.value = null
    try {
      if (useMock) {
        uploadHistory.value.unshift({
          id: String(Date.now()),
          filename: file.name,
          status: 'Processing',
          uploaded_at: 'just now',
        })
        return
      }
      // Implement actual upload logic here (e.g., Supabase Storage)
      // For now, just simulate
      uploadHistory.value.unshift({
        id: String(Date.now()),
        filename: file.name,
        status: 'Processing',
        uploaded_at: 'just now',
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to upload file.'
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: any) {
    loading.value = true
    error.value = null
    try {
      if (useMock) {
        // Simulate product add
        return
      }
      // Implement actual add logic here (e.g., insert into products table)
    } catch (e: any) {
      error.value = e.message || 'Failed to add product.'
    } finally {
      loading.value = false
    }
  }

  // Optionally, fetch on composable use
  fetchUploads()

  return {
    uploadHistory,
    loading,
    error,
    refresh: fetchUploads,
    uploadFile,
    addProduct,
  }
}
