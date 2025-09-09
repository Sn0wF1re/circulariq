<template>
  <div>
    <div class="mb-4">
      <h2 class="text-xl md:text-2xl font-bold">Compliance Dashboard</h2>
      <p class="text-gray-600 text-sm md:text-base">Monitor regulatory compliance across all products</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6 w-full">
      <Card v-for="company in companies" :key="company.id" class="w-full p-2 md:p-4">
        <CardHeader>
          <CardTitle class="flex items-center justify-between text-base md:text-lg">
            <span>{{ company.name }}</span>
            <span class="px-2 py-1 rounded text-xs font-semibold"
              :class="getComplianceColor(company.compliance_score.overall_score)">
              {{ company.compliance_score.overall_score }}% Compliant
            </span>
          </CardTitle>
          <CardDescription class="text-xs md:text-sm">
            {{ company.sector }} • {{ getRegionName(company.region_id) }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2 md:space-y-4">
          <div>
            <div class="flex justify-between text-xs md:text-sm mb-1 md:mb-2">
              <span>Regulations Met</span>
              <span>{{ company.compliance_score.regulations_met }} / {{ company.compliance_score.total_regulations }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Progress :value="company.compliance_score.overall_score" class="h-2 w-full" />
              <CheckCircle class="w-4 h-4 text-green-600" v-if="company.compliance_score.overall_score >= 90" />
              <AlertTriangle class="w-4 h-4 text-yellow-600" v-else-if="company.compliance_score.overall_score >= 70" />
              <AlertTriangle class="w-4 h-4 text-red-600" v-else />
            </div>
          </div>
          <Separator class="h-px" />
          <div class="space-y-1 md:space-y-2">
            <h4 class="font-medium text-sm md:text-base">Regulation Profile:</h4>
            <div class="flex flex-row flex-wrap gap-2 overflow-x-auto">
              <span class="bg-gray-100 rounded-full px-3 py-1 text-xs font-mono border border-gray-300 shadow-sm">
                {{ getRegulationProfileName(company.regulation_profile_id) }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle, AlertTriangle } from 'lucide-vue-next'
const { companies, loading, error, refresh } = useCompliance()
const { getRegionName, getRegulationProfileName } = useRegionAndRegulationNames()

function getComplianceColor(score) {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
</script>
