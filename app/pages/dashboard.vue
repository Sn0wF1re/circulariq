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
      <Card class="flex flex-col items-center justify-center h-64 p-4">
        <div class="w-full h-full">
          <template v-if="trendData.length">
            <canvas ref="trendChart" class="w-full h-56"></canvas>
          </template>
          <template v-else>
            <span class="text-gray-400">No trend data available</span>
          </template>
        </div>
      </Card>
      <Card class="p-4">
        <div class="font-semibold mb-2">Recent Alerts</div>
        <ul v-if="alerts.length">
          <li v-for="alert in alerts" :key="alert.id" class="mb-2 flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 text-yellow-700" />
            <span>{{ alert.message }}</span>
            <span class="text-xs text-gray-400 ml-auto">{{ new Date(alert.date).toLocaleDateString() }}</span>
          </li>
        </ul>
        <span v-else class="text-gray-400">No recent alerts</span>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Package as IconPackage, Recycle as IconRecycle, AlertTriangle as IconAlertTriangle, CheckCircle as IconCheckCircle, Building2 as IconBuilding2 } from 'lucide-vue-next'

const { companies } = useCompanies()
import { onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
const { kpi, loading, error, fetchKpi, trendData, alerts } = useDashboardData()
const selectedCompany = ref('')
const trendChart = ref(null)
let chartInstance = null

function renderTrendChart() {
  if (!trendChart.value || !trendData.value.length) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  const ctx = trendChart.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.value.map(d => d.period),
      datasets: [
        {
          label: 'Plastic Usage (kg)',
          data: trendData.value.map(d => d.plastic),
          borderColor: '#28A745',
          backgroundColor: 'rgba(40,167,69,0.1)',
          yAxisID: 'y1',
        },
        {
          label: 'CO2e (tons)',
          data: trendData.value.map(d => (d.co2e / 1000).toFixed(2)),
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255,193,7,0.1)',
          yAxisID: 'y2',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y1: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Plastic (kg)' }
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'CO2e (tons)' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  })
}

onMounted(() => {
  if (companies.value.length > 0) {
    selectedCompany.value = companies.value[0].id
    fetchKpi(selectedCompany.value)
  }
})

watch(selectedCompany, (newId) => {
  if (newId) fetchKpi(newId)
})

watch(trendData, () => {
  renderTrendChart()
})

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>
