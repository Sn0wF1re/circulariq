// useUserCompanies composable for Supabase MCP integration
import { ref } from 'vue'
// Replace with actual Supabase MCP client import if available

export default function useUserCompanies() {
  const loading = ref(false)
  const error = ref(null)

  async function assignToCompany(companyId, role) {
    loading.value = true
    error.value = null
    try {
      // Example: Use MCP tool to insert into user_companies table
      // Replace with actual MCP call
      const userId = $supabase.auth.user().id
      const { data, error: supaError } = await $supabase.from('user_companies').insert([
        { user_id: userId, company_id: companyId, role }
      ])
      if (supaError) throw supaError
      return data
    } catch (e) {
      error.value = e.message || 'Failed to assign user to company.'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { assignToCompany, loading, error }
}
