<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-bold">Settings</h2>
      <p class="text-gray-600">Manage your account and platform preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Company Management Section -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Company Management</CardTitle>
          <CardDescription>Manage your company memberships and create new organizations</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="isAdminOrOwner">
            <div class="flex flex-col md:flex-row md:items-end gap-4">
              <div class="flex flex-col gap-1 flex-1 min-w-[220px]">
                <Label class="mb-1">Current Company</Label>
                <Select v-model="activeCompanyId">
                  <SelectTrigger>
                    <SelectValue :placeholder="activeCompany?.name || 'Select company'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button @click="showAddCompany = true" class="bg-[#28A745] hover:bg-[#14532D] h-10 md:mb-0 md:ml-2">Add Company</Button>
            </div>
            <div v-if="activeCompany">
              <p class="mt-2 text-sm text-gray-600">Sector: {{ activeCompany.sector }} | Region: {{ getRegionName(activeCompany.region_id) }}</p>
              <p class="text-sm text-gray-600">Compliance: {{ activeCompany.compliance_status?.status || activeCompany.compliance_status }}</p>
            </div>
          </div>
          <div v-else>
            <p>You are a member of <b>{{ activeCompany?.name }}</b>. To create your own company, contact an admin.</p>
            <Button variant="outline" class="mt-2" @click="requestCompany = true">Request New Company</Button>
          </div>
          <!-- Add Company Dialog -->
          <Dialog v-model:open="showAddCompany">
            <DialogContent>
              <DialogTitle>Add New Company</DialogTitle>
              <form @submit.prevent="onAddCompany" class="space-y-3">
                <Input v-model="newCompany.name" placeholder="Company Name" required />
                <Input v-model="newCompany.sector" placeholder="Sector" required />
                <Input v-model="newCompany.region_id" placeholder="Region ID" required />
                <Input v-model="newCompany.regulation_profile_id" placeholder="Regulation Profile ID" />
                <Button type="submit" class="bg-[#28A745] hover:bg-[#14532D] w-full">Create Company</Button>
              </form>
            </DialogContent>
          </Dialog>
          <!-- Request Company Dialog -->
          <Dialog v-model:open="requestCompany">
            <DialogContent>
              <DialogTitle>Request New Company</DialogTitle>
              <p class="mb-2">Let us know why you want to create a new company. An admin will review your request.</p>
              <textarea v-model="requestReason" class="w-full border rounded p-2" rows="3" placeholder="Reason (optional)"></textarea>
              <Button class="mt-2 w-full" @click="submitRequest">Submit Request</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <!-- Account Information Card -->
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="full-name">Full Name</Label>
            <Input id="full-name" v-model="profile.full_name" placeholder="John Smith" />
          </div>
          <div>
            <Label for="email">Email Address</Label>
            <Input id="email" v-model="profile.email" type="email" placeholder="john.smith@ecotech.com" />
          </div>
          <div>
            <Label for="phone">Phone Number</Label>
            <Input id="phone" v-model="profile.phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <Label for="timezone">Timezone</Label>
            <Select v-model="profile.timezone">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Standard Time</SelectItem>
                <SelectItem value="est">Eastern Standard Time</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="cet">Central European Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button class="bg-[#28A745] hover:bg-[#14532D]" @click="updateUserProfile">
            Update Account
          </Button>
import { useSupabaseClient, useSupabaseUser } from '#imports'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// User profile state
const profile = ref({
  full_name: user.value?.user_metadata?.full_name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  timezone: 'utc',
})

async function updateUserProfile() {
  try {
    // Update auth user (email, phone)
    if (profile.value.email !== user.value?.email) {
      const { error } = await supabase.auth.updateUser({ email: profile.value.email })
      if (error) throw error
    }
    if (profile.value.phone && profile.value.phone !== user.value?.phone) {
      const { error } = await supabase.auth.updateUser({ phone: profile.value.phone })
      if (error) throw error
    }
    // Update user_metadata (full_name, timezone)
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        full_name: profile.value.full_name,
        timezone: profile.value.timezone
      }
    })
    if (metaError) throw metaError
    alert('Profile updated!')
  } catch (e: any) {
    alert('Failed to update profile: ' + (e.message || e))
  }
}
        </CardContent>
      </Card>
      <!-- Company Settings Card -->
      <!-- Data & Privacy Card -->
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Data Analytics</p>
                <p class="text-sm text-gray-600">Help improve our platform with usage analytics</p>
              </div>
              <input type="checkbox" class="rounded" checked />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Marketing Communications</p>
                <p class="text-sm text-gray-600">Receive updates about new features</p>
              </div>
              <input type="checkbox" class="rounded" />
            </div>
          </div>
          <Separator />
          <div class="space-y-3">
            <h4 class="font-medium text-red-600">Danger Zone</h4>
            <Button variant="outline" class="text-red-600 border-red-300 hover:bg-red-50">
              Export All Data
            </Button>
            <Button variant="outline" class="text-red-600 border-red-300 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
      <!-- API & Integrations Card -->
      <Card>
        <CardHeader>
          <CardTitle>API & Integrations</CardTitle>
          <CardDescription>Manage external connections and API access</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <p class="font-medium mb-2">API Key</p>
            <div class="flex items-center space-x-2">
              <Input value="pk_test_51J..." readonly class="font-mono" />
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
            <p class="text-sm text-gray-600 mt-1">Use this key to integrate with our API</p>
          </div>
          <Separator />
          <div>
            <p class="font-medium mb-3">Connected Apps</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p class="font-medium">Salesforce</p>
                  <p class="text-sm text-gray-600">CRM integration</p>
                </div>
                <Badge class="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div class="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p class="font-medium">SAP</p>
                  <p class="text-sm text-gray-600">ERP system</p>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
          <CardDescription>Configure your organization details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-col gap-1">
            <Label for="company-name">Company Name</Label>
            <Input id="company-name" v-model="companyName" placeholder="EcoTech Solutions" />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="sector">Sector</Label>
            <Input id="sector" v-model="sector" placeholder="Technology" />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="region">Region</Label>
            <Input id="region" v-model="region_id" placeholder="North America" />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="regulation-profile">Regulation Profile</Label>
            <Input id="regulation-profile" v-model="regulation_profile_id" placeholder="EU Packaging" />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="compliance-status">Compliance Status</Label>
            <Input id="compliance-status" v-model="complianceStatus" placeholder="Compliant" />
          </div>
          <Button class="bg-[#28A745] hover:bg-[#14532D]">
            Update Company
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, watch, onMounted } from 'vue'

// Multi-company management state
const { companies, loading: companiesLoading, error: companiesError, refresh: refreshCompanies, addCompany } = useCompanies({ useMock: false })
const activeCompanyId = ref<string | null>(null)
const showAddCompany = ref(false)
const requestCompany = ref(false)
const requestReason = ref('')
const newCompany = ref({ name: '', sector: '', region_id: '', regulation_profile_id: '' })

// Set active company to first in list by default
onMounted(() => {
  if (companies.value.length > 0) {
    activeCompanyId.value = companies.value[0].id
  }
})
// Watch for company list changes
watch(companies, (val) => {
  if (val.length > 0 && !activeCompanyId.value) {
    activeCompanyId.value = val[0].id
  }
})

const activeCompany = computed(() => companies.value.find(c => c.id === activeCompanyId.value) || null)

// Example: check if user is admin/owner in selected company
const isAdminOrOwner = computed(() => {
  const role = activeCompany.value?.role
  return role === 'admin' || role === 'owner' || role === 'Admin' || role === 'Owner'
})

async function onAddCompany() {
  const { error } = await addCompany(newCompany.value)
  if (!error) {
    showAddCompany.value = false
    newCompany.value = { name: '', sector: '', region_id: '', regulation_profile_id: '' }
  } else {
    alert('Failed to create company: ' + error)
  }
}

async function submitRequest() {
  // Insert a notification for admin/support
  try {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    await supabase.from('notifications').insert([
      {
        user_id: user.value?.id,
        company_id: null,
        type: 'company_request',
        message: `User ${user.value?.email || user.value?.id} requested a new company. Reason: ${requestReason.value}`,
        read: false,
        meta: { reason: requestReason.value }
      }
    ])
    requestCompany.value = false
    requestReason.value = ''
    alert('Request submitted!')
  } catch (e: any) {
    alert('Failed to submit request: ' + (e.message || e))
  }
}

const { settings, loading, error, refresh, updateSettings } = useSettings({ useMock: false })

// v-models for company fields (matching schema)
const companyName = computed({
  get: () => activeCompany.value?.name || '',
  set: v => { if (activeCompany.value) activeCompany.value.name = v }
})
const sector = computed({
  get: () => activeCompany.value?.sector || '',
  set: v => { if (activeCompany.value) activeCompany.value.sector = v }
})
const region_id = computed({
  get: () => activeCompany.value?.region_id || '',
  set: v => { if (activeCompany.value) activeCompany.value.region_id = v }
})
const regulation_profile_id = computed({
  get: () => activeCompany.value?.regulation_profile_id || '',
  set: v => { if (activeCompany.value) activeCompany.value.regulation_profile_id = v }
})
const { getRegionName, getRegulationProfileName } = useRegionAndRegulationNames()
const complianceStatus = computed({
  get: () => activeCompany.value?.compliance_status || '',
  set: v => { if (activeCompany.value) activeCompany.value.compliance_status = v }
})
</script>
