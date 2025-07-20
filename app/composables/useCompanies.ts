// composable for companies (mock data, ready for Supabase integration)
import { ref } from 'vue'

export function useCompanies() {
  // Mock data
  const companies = ref([
    {
      id: '1',
      name: 'EcoTech Solutions',
      sector: 'Technology',
      region: 'North America',
      compliance_status: {
        overall_score: 85,
        regulations_met: 17,
        total_regulations: 20
      },
      regulation_profile: 'EU-US-CA'
    },
    {
      id: '2',
      name: 'GreenPack Industries',
      sector: 'Packaging',
      region: 'Europe',
      compliance_status: {
        overall_score: 92,
        regulations_met: 18,
        total_regulations: 20
      },
      regulation_profile: 'EU-UK'
    }
  ])

  // For future: fetch from Supabase
  // const { data, error } = await supabase.from('companies').select('*')
  // companies.value = data

  return { companies }
}
