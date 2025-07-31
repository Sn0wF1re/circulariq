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
            <span :class="region ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="region" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="region ? 'text-green-700' : 'text-gray-500'">Region</span>
          </li>
          <li class="flex items-center gap-2">
            <span :class="regulation ? 'text-green-600' : 'text-gray-400'">
              <IconCheck v-if="regulation" class="w-4 h-4" />
              <IconCircle v-else class="w-4 h-4" />
            </span>
            <span :class="regulation ? 'text-green-700' : 'text-gray-500'">Regulation Profile</span>
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
          <Input id="region" v-model="region" placeholder="North America" required />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="regulation">Regulation Profile</Label>
          <Input id="regulation" v-model="regulation" placeholder="EU Packaging" required />
        </div>
        <div class="flex flex-col gap-1">
          <Label for="compliance">Compliance Status</Label>
          <Input id="compliance" v-model="compliance" placeholder="Compliant" required />
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
const region = ref('')
const regulation = ref('')
const compliance = ref('')
const loading = ref(false)
const error = ref('')
const userRole = ref('owner')
const companyLocked = ref(false)
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  await fetchStatus()
  // No prefill for first/last name; always editable in onboarding
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
      region.value = companyData.region || ''
      regulation.value = companyData.regulation_profile || ''
      compliance.value = companyData.compliance_status || ''
      companyLocked.value = true
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
  // Update user profile with first/last name and set onboarding_complete true
  await supabase.from('users').upsert({
    id: user.value.id,
    first_name: first.value,
    last_name: last.value,
    onboarding_complete: true,
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
  if (userRole.value !== 'invited') {
    const result = await supabase.from('companies').upsert({
      user_id: user.value.id,
      name: company.value,
      sector: sector.value,
      region: region.value,
      regulation_profile: regulation.value,
      compliance_status: compliance.value,
    })
    upsertError = result.error
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