<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold">AI-Powered Recommendations</h2>
      <p class="text-gray-600">Intelligent suggestions to improve your sustainability profile</p>
    </div>
    <div class="mb-4 w-full max-w-xs">
      <Select v-model="selectedProduct">
        <SelectTrigger>
          <SelectValue placeholder="Filter by product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Products</SelectLabel>
            <SelectItem v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="space-y-4">
      <Card v-for="rec in filteredRecommendations" :key="rec.id">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold text-lg">{{ rec.title }}</div>
              <div class="text-sm text-gray-500">{{ getProductName(rec.product_id) }}</div>
            </div>
            <span :class="getDifficultyColor(rec.difficulty)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ rec.difficulty }}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-gray-700 mb-4">{{ rec.details }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">AI Confidence: <span class="font-bold">{{ Math.round(rec.ai_confidence * 100) }}%</span></span>
            <span class="text-xs text-gray-500">Estimated Cost: <span class="font-bold">${{ rec.estimated_cost.toLocaleString() }}</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const products = ref([
  { id: '1', name: 'Eco Water Bottle' },
  { id: '2', name: 'Biodegradable Food Container' }
])

const recommendations = ref([
  {
    id: '1',
    product_id: '1',
    title: 'Increase Recycled Content',
    details: 'Consider increasing recycled PET content from 75% to 85% to improve sustainability score',
    ai_confidence: 0.92,
    estimated_cost: 2500,
    difficulty: 'Medium'
  },
  {
    id: '2',
    product_id: '2',
    title: 'Alternative Material Research',
    details: 'Explore bio-based alternatives with higher recyclability rates',
    ai_confidence: 0.78,
    estimated_cost: 15000,
    difficulty: 'Hard'
  }
])

const selectedProduct = ref('all')

const filteredRecommendations = computed(() => {
  if (selectedProduct.value === 'all') return recommendations.value
  return recommendations.value.filter(rec => rec.product_id === selectedProduct.value)
})

function getProductName(productId) {
  const product = products.value.find(p => p.id === productId)
  return product ? product.name : 'Unknown'
}

function getDifficultyColor(difficulty) {
  if (difficulty === 'Easy') return 'bg-green-100 text-green-800'
  if (difficulty === 'Medium') return 'bg-yellow-100 text-yellow-800'
  if (difficulty === 'Hard') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
