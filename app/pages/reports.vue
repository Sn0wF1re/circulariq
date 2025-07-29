<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Footprint Reports</h2>
        <p class="text-gray-600">Generate and manage sustainability reports</p>
      </div>
      <button class="bg-[#28A745] hover:bg-[#14532D] text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Download class="w-4 h-4 mr-2" />
        Generate Report
      </button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quarterly Reports</CardTitle>
          <CardDescription>Plastic footprint and emissions data</CardDescription>
        </CardHeader>
        <CardContent>
          <table class="w-full text-left">
            <thead>
              <tr>
                <th class="font-semibold text-gray-700">Product</th>
                <th class="font-semibold text-gray-700">Period</th>
                <th class="font-semibold text-gray-700">Plastic (kg)</th>
                <th class="font-semibold text-gray-700">CO2e</th>
                <th class="font-semibold text-gray-700">Score</th>
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Pre-configured report formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">EU Compliance Report</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">Carbon Footprint Summary</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition">
              <FileText class="w-5 h-5 mr-2 text-gray-600" />
              <span class="font-medium">Recyclability Assessment</span>
            </button>
            <button class="border px-4 py-3 rounded-lg w-full flex items-center gap-3 bg-white hover:bg-gray-50 transition">
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
