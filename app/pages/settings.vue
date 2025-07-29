<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-bold">Settings</h2>
      <p class="text-gray-600">Manage your account and platform preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Account Information Card -->
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="full-name">Full Name</Label>
            <Input id="full-name" placeholder="John Smith" />
          </div>
          <div>
            <Label for="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john.smith@ecotech.com" />
          </div>
          <div>
            <Label for="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <Label for="timezone">Timezone</Label>
            <Select>
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
          <Button class="bg-[#28A745] hover:bg-[#14532D]">
            Update Account
          </Button>
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
            <Input id="region" v-model="region" placeholder="North America" />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="regulation-profile">Regulation Profile</Label>
            <Input id="regulation-profile" v-model="regulationProfile" placeholder="EU Packaging" />
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
import { computed } from 'vue'
const { settings, loading, error, refresh, updateSettings } = useSettings({ useMock: false })

// v-models for company fields (matching schema)
const companyName = computed({
  get: () => settings.value?.company?.name || '',
  set: v => updateSettings({ company: { ...settings.value.company, name: v } })
})
const sector = computed({
  get: () => settings.value?.company?.sector || '',
  set: v => updateSettings({ company: { ...settings.value.company, sector: v } })
})
const region = computed({
  get: () => settings.value?.company?.region || '',
  set: v => updateSettings({ company: { ...settings.value.company, region: v } })
})
const regulationProfile = computed({
  get: () => settings.value?.company?.regulation_profile || '',
  set: v => updateSettings({ company: { ...settings.value.company, regulation_profile: v } })
})
const complianceStatus = computed({
  get: () => settings.value?.company?.compliance_status || '',
  set: v => updateSettings({ company: { ...settings.value.company, compliance_status: v } })
})
</script>
