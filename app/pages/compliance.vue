<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Compliance Dashboard</h2>
      <p class="text-gray-600">Monitor regulatory compliance across all products</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card v-for="company in companies" :key="company.id">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>{{ company.name }}</span>
            <span class="px-2 py-1 rounded text-xs font-semibold"
              :class="getComplianceColor(company.compliance_status.overall_score)">
              {{ company.compliance_status.overall_score }}% Compliant
            </span>
          </CardTitle>
          <CardDescription>
            {{ company.sector }} • {{ company.region }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span>Regulations Met</span>
              <span>{{ company.compliance_status.regulations_met }} / {{ company.compliance_status.total_regulations }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Progress :value="company.compliance_status.overall_score" class="h-2 w-full" />
              <CheckCircle class="w-4 h-4 text-green-600" v-if="company.compliance_status.overall_score >= 90" />
              <AlertTriangle class="w-4 h-4 text-yellow-600" v-else-if="company.compliance_status.overall_score >= 70" />
              <AlertTriangle class="w-4 h-4 text-red-600" v-else />
            </div>
          </div>
          <Separator />
          <div class="space-y-2">
            <h4 class="font-medium">Regulation Profile:</h4>
            <div class="flex flex-row flex-wrap gap-2">
              <span v-for="profile in company.regulation_profile.split('-')" :key="profile" class="bg-gray-100 rounded-full px-3 py-1 text-xs font-mono border border-gray-300 shadow-sm">{{ profile }}</span>
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

function getComplianceColor(score) {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
</script>
