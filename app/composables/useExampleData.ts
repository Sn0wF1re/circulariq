// Example composable for fetching data from Supabase with mock fallback, error/loading state, and type safety
// Usage: const { data, error, loading } = useExampleData(supabase, { companyId, userId })

import { ref, computed, watchEffect } from 'vue'
// import type { SupabaseClient } from '@supabase/supabase-js' // Uncomment if using types

// Example TypeScript interface for the data
interface ExampleData {
  id: string
  name: string
  // ...other fields
}

// Example mock data
const mockExampleData: ExampleData[] = [
  { id: '1', name: 'Mock Item 1' },
  { id: '2', name: 'Mock Item 2' },
]

interface UseExampleDataOptions {
  companyId: string
  userId?: string
  useMock?: boolean // Optional: force mock data
}

export function useExampleData(
  supabase: any, // Replace 'any' with 'SupabaseClient' if you have types
  options: UseExampleDataOptions
) {
  const data = ref<ExampleData[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // Environment toggle: use mock data if in dev or forced
  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    loading.value = true
    error.value = null
    if (useMock.value) {
      data.value = mockExampleData
      loading.value = false
      return
    }
    // Example Supabase query
    const { data: result, error: err } = await supabase
      .from('example_table')
      .select('*')
      .eq('company_id', options.companyId)
    if (err) {
      error.value = err
      data.value = mockExampleData // fallback to mock
    } else {
      data.value = result || []
    }
    loading.value = false
  }

  // Fetch on composable use
  watchEffect(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}

// Add JSDoc comments and update types/fields as needed for your specific data entity.
