<template>
  <TooltipProvider>
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold">AI-Powered Recommendations</h2>
        <p class="text-gray-600">Intelligent suggestions to improve your sustainability profile</p>
      </div>
  <div class="mb-4 w-full flex flex-col gap-2 md:flex-row md:gap-4 md:max-w-xs">
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
        <Select v-model="statusFilter" class="min-w-[120px]">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unimplemented">Unimplemented</SelectItem>
            <SelectItem value="implemented">Implemented</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-4">
        <Card v-for="rec in filteredRecommendations" :key="rec.id" :class="implementedIds.includes(rec.id) ? 'opacity-60' : ''">
          <CardHeader>
            <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <div class="font-semibold text-lg flex items-center gap-2">
                  {{ rec.title }}
                  <CheckCircle v-if="implementedIds.includes(rec.id)" class="w-4 h-4 text-green-500" />
                </div>
                <div class="text-sm text-gray-500">{{ getProductName(rec.product_id) }}</div>
              </div>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1">
                    <component :is="getDifficultyIcon(rec.difficulty)" :class="getDifficultyIconColor(rec.difficulty)" class="w-4 h-4" />
                    <span :class="getDifficultyColor(rec.difficulty)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ rec.difficulty }}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {{ getDifficultyDescription(rec.difficulty) }}
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700 mb-4">{{ rec.details }}</p>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500">AI Confidence: <span class="font-bold">{{ Math.round(rec.ai_confidence * 100) }}%</span></span>
              <span class="text-xs text-gray-500">Estimated Cost: <span class="font-bold">${{ rec.estimated_cost.toLocaleString() }}</span></span>
            </div>
            <div class="h-2 bg-gray-100 rounded overflow-hidden">
              <div
                class="progress-bar h-full transition-all"
                :class="[
                  rec.ai_confidence >= 0.8 ? 'bg-green-500' :
                  rec.ai_confidence >= 0.5 ? 'bg-yellow-500' :
                  'bg-red-500'
                ]"
                :style="{ width: Math.round(rec.ai_confidence * 100) + '%' }"
              />
            </div>
            <div class="flex flex-col gap-2 md:flex-row md:gap-2 mt-4">
              <button
                v-if="!implementedIds.includes(rec.id)"
                @click="markAsImplemented(rec.id)"
                :disabled="loadingIds.includes(rec.id)"
                class="w-full md:w-auto px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 flex items-center gap-2"
              >
                <Loader2 v-if="loadingIds.includes(rec.id)" class="animate-spin w-4 h-4" />
                <span>Mark as Implemented</span>
              </button>
              <Dialog>
                <DialogTrigger as-child>
                  <button class="w-full md:w-auto px-3 py-1 bg-primary text-white rounded text-xs font-semibold hover:bg-primary/90">View Details</button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{{ rec.title }}</DialogTitle>
                    <DialogDescription>
                      <div class="mb-2 text-sm text-gray-500">Product: <span class="font-bold">{{ getProductName(rec.product_id) }}</span></div>
                      <div class="mb-2 text-sm text-gray-500">Difficulty: <span :class="getDifficultyColor(rec.difficulty)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ rec.difficulty }}</span></div>
                      <div class="mb-2 text-sm text-gray-500">AI Confidence: <span class="font-bold">{{ Math.round(rec.ai_confidence * 100) }}%</span></div>
                      <div class="mb-2 text-sm text-gray-500">Estimated Cost: <span class="font-bold">${{ rec.estimated_cost.toLocaleString() }}</span></div>
                      <div class="mt-4 text-gray-700">{{ rec.details }}</div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div class="flex flex-col gap-2 md:flex-row md:gap-2 w-full">
                      <DialogClose as-child>
                        <button class="w-full md:w-auto px-3 py-1 bg-gray-200 rounded text-xs font-semibold hover:bg-gray-300">Close</button>
                      </DialogClose>
                      <button @click="downloadRecommendation(rec)" class="w-full md:w-auto px-3 py-1 bg-secondary text-xs font-semibold rounded hover:bg-secondary/90">Download Recommendation</button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-vue-next'

const { recommendations, implementedIds, loading, fetchRecommendations, markAsImplemented } = useRecommendations()
const { products, fetchProducts } = useProducts()

onMounted(() => {
  fetchRecommendations()
  fetchProducts()
})

const selectedProduct = ref('all')
const statusFilter = ref('all')
const loadingIds = ref([])

const filteredRecommendations = computed(() => {
  let recs = recommendations.value
  if (selectedProduct.value !== 'all') {
    recs = recs.filter(rec => rec.product_id === selectedProduct.value)
  }
  if (statusFilter.value === 'implemented') {
    recs = recs.filter(rec => implementedIds.value.includes(rec.id))
  } else if (statusFilter.value === 'unimplemented') {
    recs = recs.filter(rec => !implementedIds.value.includes(rec.id))
  }
  return recs
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

function getDifficultyIcon(difficulty) {
  if (difficulty === 'Easy') return CheckCircle
  if (difficulty === 'Medium') return AlertTriangle
  if (difficulty === 'Hard') return XCircle
  return AlertTriangle
}
function getDifficultyIconColor(difficulty) {
  if (difficulty === 'Easy') return 'text-green-500'
  if (difficulty === 'Medium') return 'text-yellow-500'
  if (difficulty === 'Hard') return 'text-red-500'
  return 'text-gray-400'
}

function getDifficultyDescription(difficulty) {
  if (difficulty === 'Easy') return 'Low effort, quick win.'
  if (difficulty === 'Medium') return 'Moderate effort, some complexity.'
  if (difficulty === 'Hard') return 'High effort, significant complexity.'
  return 'Unknown difficulty.'
}

function markAsImplementedHandler(id) {
  if (!implementedIds.value.includes(id)) {
    loadingIds.value.push(id)
    markAsImplemented(id).finally(() => {
      loadingIds.value = loadingIds.value.filter(lid => lid !== id)
    })
  }
}

function downloadRecommendation(rec) {
  // Placeholder: will be replaced with real PDF export
  const details = `Recommendation: ${rec.title}\nProduct: ${getProductName(rec.product_id)}\nDifficulty: ${rec.difficulty}\nAI Confidence: ${Math.round(rec.ai_confidence * 100)}%\nEstimated Cost: $${rec.estimated_cost.toLocaleString()}\nDetails: ${rec.details}`
  const blob = new Blob([details], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${rec.title.replace(/\s+/g, '_')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
