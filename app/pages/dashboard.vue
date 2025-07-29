<script setup lang="ts">
import { useSupabaseClient } from '#imports'
import { useKpi } from '~/app/composables/useKpi'
import { useDashboardData } from '~/app/composables/useDashboardData'
import { ref, watch } from 'vue'

const supabase = useSupabaseClient()
const selectedCompany = ref('company-1') // TODO: Replace with actual logic

const { kpi, error: kpiError, loading: kpiLoading, refetch: refetchKpi } = useKpi(supabase, { companyId: selectedCompany.value })
const { companies, loading: companiesLoading } = useDashboardData(supabase, { companyId: selectedCompany.value })

watch(selectedCompany, () => {
  refetchKpi()
})
</script>
<template>
  <div>
    <!-- Company Selector -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <IconBuilding2 class="w-5 h-5" />
          Company Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select v-model="selectedCompany">
          <SelectTrigger class="w-full max-w-md">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="company in companies" :key="company.id" :value="company.id">
              {{ company.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex items-center gap-2 mb-2">
          <IconPackage class="w-5 h-5 text-green-700" />
          <span class="text-sm font-medium">Total Plastic Usage</span>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kpi.plasticUsage }} kg</div>
          <div class="text-xs text-green-600 mt-1">-12% from last quarter</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex items-center gap-2 mb-2">
          <IconRecycle class="w-5 h-5 text-green-700" />
          <span class="text-sm font-medium">Recyclability Score</span>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kpi.recyclability }}%</div>
          <div class="text-xs text-green-600 mt-1">+5% from last quarter</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex items-center gap-2 mb-2">
          <IconAlertTriangle class="w-5 h-5 text-yellow-700" />
          <span class="text-sm font-medium">CO2e Emissions</span>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kpi.co2e }} tons</div>
          <div class="text-xs text-green-600 mt-1">-8% from last quarter</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex items-center gap-2 mb-2">
          <IconCheckCircle class="w-5 h-5 text-blue-700" />
          <span class="text-sm font-medium">Compliance Score</span>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kpi.compliance }}%</div>
          <div class="text-xs text-gray-600 mt-1">17 of 20 regulations met</div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="flex items-center justify-center h-64">
        <span class="text-gray-400">[Plastic Footprint Trend Chart]</span>
      </Card>
      <Card>
        <span class="text-gray-400">[Recent Alerts]</span>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCompanies } from '../composables/useCompanies'
import { Package as IconPackage, Recycle as IconRecycle, AlertTriangle as IconAlertTriangle, CheckCircle as IconCheckCircle, Building2 as IconBuilding2 } from 'lucide-vue-next'

const { companies } = useCompanies()
const selectedCompany = ref(companies.value[0]?.id || '')

const kpi = computed(() => {
  // Example mock KPIs, could be dynamic per company
  return {
    plasticUsage: 2140,
    recyclability: 78,
    co2e: 5.3,
    compliance: 85
  }
})
</script>
