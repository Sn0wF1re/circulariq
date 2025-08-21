<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EFFBF0]">
    <Card class="w-full max-w-2xl min-w-[350px] p-10 shadow-lg bg-white rounded-xl">
      <CardHeader class="mb-6 text-center">
        <IconCompass class="mx-auto w-10 h-10 text-[#28A745] mb-2" />
        <CardTitle class="text-2xl font-bold">Welcome to CircularIQ</CardTitle>
        <CardDescription class="text-gray-600">Let's set up your company profile</CardDescription>
      </CardHeader>
      <!-- Onboarding Progress Checklist -->
      <div class="mb-8">
        <ul class="flex flex-col gap-2">
          <li class="flex items-center gap-2">
            <span :class="first ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="first" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="first ? 'text-green-700' : 'text-gray-500'">First Name</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="last ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="last" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="last ? 'text-green-700' : 'text-gray-500'">Last Name</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="company ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="company" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="company ? 'text-green-700' : 'text-gray-500'">Company Name</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="sector ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="sector" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="sector ? 'text-green-700' : 'text-gray-500'">Sector</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="region_id ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="region_id" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="region_id ? 'text-green-700' : 'text-gray-500'">Region</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="regulation_profile_id ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="regulation_profile_id" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="regulation_profile_id ? 'text-green-700' : 'text-gray-500'">Regulation Profile</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="compliance ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="compliance" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="compliance ? 'text-green-700' : 'text-gray-500'">Compliance Status</span>
          </li>
        </ul>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div class="flex gap-3">
          <div class="flex-1 flex flex-col gap-1">
            <Label for="first">First Name</Label>
            <Input id="first" v-model="first" type="text" placeholder="Jane" required />
          </div>
          <div class="flex-1 flex flex-col gap-1">
            <Label for="last">Last Name</Label>
            <Input id="last" v-model="last" type="text" placeholder="Doe" required />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <Label for="company">Company Name</Label>
          <Input id="company" v-model="company" placeholder="EcoTech Solutions" required />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="sector">Sector</Label>
          <Input id="sector" v-model="sector" placeholder="Technology" required />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="region-select">Region</Label>
          <Select v-model="region_id">
            <SelectTrigger id="region-select" class="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</SelectItem>
            </SelectContent>
          </Select>          
        </div>
        <div class="flex flex-col gap-1">
          <Label for="regulation-profile">Regulation Profile</Label>
          <Select v-model="regulation_profile_id">
            <SelectTrigger id="regulation-profile" class="w-full">
              <SelectValue placeholder="Select regulation profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="profile in regulationProfiles" :key="profile.id" :value="profile.id">{{ profile.name }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col gap-1">
          <Label for="compliance-status">Compliance Status</Label>
          <Select v-model="compliance">
            <SelectTrigger id="compliance-status" class="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="non-compliant">Non-compliant</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" :disabled="loading" class="w-full bg-[#28A745] hover:bg-[#14532D] text-white font-semibold py-2 rounded">
          <span v-if="loading"><IconLoader class="animate-spin w-4 h-4 inline mr-2" /></span>
          Complete Setup
        </Button>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
        <div v-if="!error && loading === false && companyId" class="text-green-700 text-sm text-center">Onboarding complete! Redirecting...</div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Compass as IconCompass, Loader as IconLoader, Check as IconCheck, Circle as IconCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const first = ref<string>('')
const last = ref<string>('')
const company = ref<string>('')
const sector = ref<string>('')
const region_id = ref<string>('')
const regulation_profile_id = ref<string>('')
const compliance = ref<string>('')
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const error = ref('')
const regions = ref<{ id: string; name: string }[]>([])
const allRegulationProfiles = ref<{ id: string; name: string }[]>([])
const regulationProfiles = ref<{ id: string; name: string }[]>([])
let companyId: string | null = null

onMounted(async () => {
  // UI-level authentication check (reactive)
  if (!user.value) {
    router.push('/login')
    return
  }

  console.log('Supa user: ', user)
  // Fetch regions and all regulation profiles
  const { data: regionData } = await supabase.from('regions').select('id, name')
  regions.value = regionData || []

  const { data: regProfileData } = await supabase.from('regulation_profiles').select('id, name')
  allRegulationProfiles.value = regProfileData || []
  regulationProfiles.value = allRegulationProfiles.value

  // Watch region_id and filter regulation profiles accordingly
  watch(region_id, async (newRegionId) => {
    if (!newRegionId) {
      regulationProfiles.value = allRegulationProfiles.value
      return
    }
    const { data: regionRegProfiles, error } = await supabase
      .from('region_regulation_profiles')
      .select('regulation_profile_id')
      .eq('region_id', newRegionId)
    if (error) {
      regulationProfiles.value = allRegulationProfiles.value
      return
    }
    const allowedIds = (regionRegProfiles || []).map(r => r.regulation_profile_id)
    regulationProfiles.value = allRegulationProfiles.value.filter(profile => allowedIds.includes(profile.id))
  })
})

async function onSubmit() {
  loading.value = true
  error.value = ''
  console.log('onSubmit() - user:', user.value)
  try {
    // Update Supabase Auth user metadata (triggers sync to public.users)
    await supabase.auth.updateUser({
      data: {
        first_name: first.value,
        last_name: last.value,
        display_name: `${first.value} ${last.value}`,
        onboarding_complete: true
      }
    })
    console.log('auth user updated')

    // New company onboarding only
    console.log(`company data to be inserted with name: ${company.value}\n sector: ${sector.value}, region_id: ${region_id.value}, regulation_profile_id: ${regulation_profile_id.value}, compliance_status: ${compliance.value}`)
    let insertError
    const { data: companyData, error: companyError } = await supabase.from('companies').insert({
      name: company.value,
      sector: sector.value,
      region_id: region_id.value,
      regulation_profile_id: regulation_profile_id.value,
      compliance_status: compliance.value,
    }).select('id').maybeSingle()
    console.log(`company data inserted with ${companyData}`)
    insertError = companyError
    companyId = companyData?.id || null
    console.log(`company id from company data: ${companyId}`)
    if (companyId) {
      await supabase.from('user_companies').upsert({
        user_id: user.value.id,
        company_id: companyId,
        role: 'owner',
      })
    }
    if (insertError) {
      error.value = insertError.message || 'Failed to save company profile.'
      return
    }
  // Show a brief success message before redirecting
  error.value = ''
  console.log('Form rendered')
  router.push('/dashboard')
  } catch (err: any) {
    console.error('Submission error:', err)
    error.value = err?.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>