definePageMeta({ layout: 'blank' })
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
          <Label for="region">Region</Label>
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
          <Label for="regulation">Regulation Profile</Label>
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
          <Label for="compliance">Compliance Status</Label>
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
        <Button :disabled="loading" class="w-full bg-[#28A745] hover:bg-[#14532D] text-white font-semibold py-2 rounded">
          <span v-if="loading"><IconLoader class="animate-spin w-4 h-4 inline mr-2" /></span>
          Complete Setup
        </Button>
        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Compass as IconCompass, Loader as IconLoader, Check as IconCheck, Circle as IconCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const { userProfile, fetchStatus } = useOnboardingStatus()
const first = ref('')
const last = ref('')
const company = ref('')
const sector = ref('')
const region_id = ref('')
const regulation_profile_id = ref('')
const compliance = ref('')
const loading = ref(false)
const error = ref('')
const userRole = ref('owner')
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const regions = ref<{ id: string; name: string }[]>([])
const regulationProfiles = ref<{ id: string; name: string }[]>([])

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  await fetchStatus()
  // Fetch regions and regulation profiles
  const { data: regionData } = await supabase.from('regions').select('id, name')
  regions.value = regionData || []

  const { data: regProfileData } = await supabase.from('regulation_profiles').select('id, name')
  regulationProfiles.value = regProfileData || []

  // Fetch user role
  const { data: userRoleData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.value.id)
    .single()
  userRole.value = userRoleData?.role || 'owner'
  // If invited, fetch company info and lock fields
  if (userRole.value === 'invited') {
    const { data: companyData } = await supabase
      .from('companies')
      .select('name, sector, region, regulation_profile, compliance_status')
      .eq('user_id', user.value.id)
      .single()
    if (companyData) {
      company.value = companyData.name || ''
      sector.value = companyData.sector || ''
      region_id.value = companyData.region_id || ''
      regulation_profile_id.value = companyData.regulation_profile_id || ''
      compliance.value = companyData.compliance_status || ''
    }
  }
})

async function onSubmit() {
  loading.value = true
  error.value = ''
  if (!user.value) {
    error.value = 'User not authenticated.'
    loading.value = false
    return
  }
  // Update user profile with first/last name only
  await supabase.from('users').upsert({
    id: user.value.id,
    first_name: first.value,
    last_name: last.value,
  })
  // Also update Supabase Auth user metadata
  await supabase.auth.updateUser({
    data: {
      first_name: first.value,
      last_name: last.value,
      display_name: `${first.value} ${last.value}`,
    }
  })
  // If invited, do not allow company creation/edit
  let upsertError
  let companyId
  if (userRole.value !== 'invited') {
    // 1. Upsert company (no user_id)
    const { data: companyData, error: companyError } = await supabase.from('companies').upsert({
      name: company.value,
      sector: sector.value,
      region_id: region_id.value,
      regulation_profile_id: regulation_profile_id.value,
      compliance_status: compliance.value,
    }).select('id').single()
    upsertError = companyError
    companyId = companyData?.id
    // 2. Add user as admin in user_companies
    if (companyId) {
      await supabase.from('user_companies').upsert({
        user_id: user.value.id,
        company_id: companyId,
        role: 'owner',
      })
    }
  }
  loading.value = false
  if (upsertError) {
    error.value = upsertError.message || 'Failed to save company profile.'
    return
  }
  router.push('/dashboard')
}
</script>

<style scoped>
input:focus {
  outline: 2px solid #28A745;
  outline-offset: 2px;
}
</style>