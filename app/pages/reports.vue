<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Header & Button -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 w-full">
      <div class="w-full md:w-auto">
        <h2 class="text-xl md:text-2xl font-bold">Footprint Reports</h2>
        <p class="text-gray-600 text-sm md:text-base">Generate and manage sustainability reports</p>
      </div>
  <button class="bg-[#28A745] hover:bg-[#14532D] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center mx-auto">
        <Download class="w-4 h-4 mr-2" />
        Generate Report
      </button>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6 w-full">
      <!-- Quarterly Reports: Table on desktop, cards on mobile -->
      <Card class="lg:col-span-2 w-full">
        <CardHeader>
          <CardTitle class="text-base md:text-lg">Quarterly Reports</CardTitle>
          <CardDescription class="text-xs md:text-sm">Plastic footprint and emissions data</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Desktop Table -->
          <div class="hidden md:block w-full overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr>
                  <th class="font-semibold text-gray-700 whitespace-nowrap">Product</th>
                  <th class="font-semibold text-gray-700 whitespace-nowrap">Period</th>
                  <th class="font-semibold text-gray-700 whitespace-nowrap">Plastic (kg)</th>
                  <th class="font-semibold text-gray-700 whitespace-nowrap">CO2e</th>
                  <th class="font-semibold text-gray-700 whitespace-nowrap">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
                  <td class="px-4 py-3">{{ getProductName(report.product_id) }}</td>
                  <td class="px-4 py-3">{{ report.reporting_period }}</td>
                  <td class="px-4 py-3">{{ report.total_plastic_kg }}</td>
                  <td class="px-4 py-3">{{ report.emissions_co2e }}</td>
                  <td class="px-4 py-3">{{ report.footprint_score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Mobile Cards -->
          <div class="md:hidden flex flex-col gap-3 w-full">
            <div v-for="report in reports" :key="report.id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col gap-2 w-full">
              <div class="font-semibold text-base">{{ getProductName(report.product_id) }}</div>
              <div class="flex flex-col gap-1 text-xs">
                <div><span class="font-medium text-gray-600">Period:</span> {{ report.reporting_period }}</div>
                <div><span class="font-medium text-gray-600">Plastic (kg):</span> {{ report.total_plastic_kg }}</div>
                <div><span class="font-medium text-gray-600">CO2e:</span> {{ report.emissions_co2e }}</div>
                <div><span class="font-medium text-gray-600">Score:</span> {{ report.footprint_score }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <!-- Report Templates -->
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-base md:text-lg">Report Templates</CardTitle>
          <CardDescription class="text-xs md:text-sm">Pre-configured report formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-2 md:gap-4 w-full">
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition text-sm md:text-base justify-center mx-auto">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">EU Compliance Report</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition text-sm md:text-base">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">Carbon Footprint Summary</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition text-sm md:text-base">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">Recyclability Assessment</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition text-sm md:text-base">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">Custom Report Builder</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Download, FileText } from 'lucide-vue-next'
const { reports, loading, error, refresh } = useReports()
const { products } = useProducts()

function getProductName(productId) {
  const product = products.value.find(p => p.id === productId)
  return product ? product.name : 'Unknown'
}
</script>
