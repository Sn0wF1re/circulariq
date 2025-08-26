<template>
  <div>
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {{ successMessage }}
    </div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Product Catalog</h2>
        <p class="text-gray-600">Manage your product sustainability profiles</p>
      </div>
      <Dialog v-model="showAddDialog">
        <DialogTrigger as-child>
          <button class="bg-[#28A745] hover:bg-[#14532D] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus class="w-4 h-4 mr-2" />
            Add Product
          </button>
        </DialogTrigger>
        <DialogContent class="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details for sustainability tracking</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleAddProduct">
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <Label for="product-name" class="block">Product Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        The name of your product as it will appear in the catalog.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="product-name" v-model="newProduct.name" placeholder="Enter product name" required class="w-full border border-gray-300 bg-white" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="sku-code" class="block">SKU Code
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Stock Keeping Unit: unique code for tracking this product.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="sku-code" v-model="newProduct.sku_code" placeholder="Enter SKU code" required class="w-full border border-gray-300 bg-white" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="material" class="block">Material
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        The main material of the product. Affects recyclability.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select v-model="newProduct.material">
                  <SelectTrigger id="material" class="w-full border border-gray-300 bg-white">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rPET">rPET</SelectItem>
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="HDPE">HDPE</SelectItem>
                    <SelectItem value="PP">PP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-1">
                <Label for="weight-grams" class="block">Weight (grams)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Total weight of the product in grams.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="weight-grams" v-model.number="newProduct.weight_grams" type="number" min="1" placeholder="Enter weight in grams" required class="w-full border border-gray-300 bg-white" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="recycled-weight" class="block">Recycled Content (grams)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        How much of the product's weight is from recycled material? Must be less than or equal to total weight.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="recycled-weight" v-model.number="newProduct.recycled_weight" type="number" min="0" :max="newProduct.weight_grams" placeholder="Enter recycled weight in grams" required class="w-full border border-gray-300 bg-white" />
                <div v-if="newProduct.weight_grams > 0" class="text-xs text-gray-500 mt-1">
                  Recycled Content: <span class="font-semibold">{{ recycledPctComputed }}%</span>
                  <span v-if="newProduct.recycled_weight > newProduct.weight_grams" class="text-red-600 ml-2">Recycled weight cannot exceed total weight.</span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Label for="recyclability-pct" class="block">Recyclability (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        What percent of this product can be recycled after use? Auto-filled from material, but you can override.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div class="flex items-center gap-2">
                  <Input
                    id="recyclability-pct"
                    v-model.number="newProduct.recyclability_pct"
                    type="number"
                    min="0"
                    max="100"
                    :placeholder="recyclabilityDefault !== null ? `Typical: ${recyclabilityDefault}%` : 'Enter percentage'"
                    required
                    class="w-full border border-gray-300 bg-white"
                  />
                  <span v-if="recyclabilityDefault !== null" class="text-xs text-gray-500" :title="`Typical recyclability for ${newProduct.material} is ${recyclabilityDefault}%`">
                    (default: {{ recyclabilityDefault }}%)
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Label for="reuse-pct" class="block">Reuse (%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info class="ml-1 w-4 h-4 text-gray-400 cursor-help inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        What percent of this product is designed for reuse? Optional.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="reuse-pct" v-model.number="newProduct.reuse_pct" type="number" min="0" max="100" placeholder="Enter percentage" class="w-full border border-gray-300 bg-white" />
              </div>
              <Button
                type="submit"
                class="w-full bg-[#28A745] hover:bg-[#14532D] text-white py-2 rounded-lg flex items-center justify-center gap-2"
                :disabled="!isFormValid"
              >
                <Plus class="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <Card>
      <CardHeader>
        <div class="flex items-center space-x-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search products..."
              class="pl-10 border rounded-lg py-2 w-full"
            />
          </div>
          <button class="border px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter class="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="font-semibold text-gray-700">Product</th>
              <th class="font-semibold text-gray-700">SKU</th>
              <th class="font-semibold text-gray-700">Material</th>
              <th class="font-semibold text-gray-700">Weight</th>
              <th class="font-semibold text-gray-700">Recycled %</th>
              <th class="font-semibold text-gray-700">Recyclability %</th>
              <th class="font-semibold text-gray-700">Compliance Score</th>
              <th class="font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
              <td class="font-medium flex items-center gap-2 px-4 py-3">
                <Package class="w-4 h-4 text-green-700" />
                {{ product.name }}
              </td>
              <td class="px-4 py-3">{{ product.sku_code }}</td>
              <td class="px-4 py-3">{{ product.material }}</td>
              <td class="px-4 py-3">{{ product.weight_grams }}g</td>
              <td class="px-4 py-3">{{ product.recycled_pct }}%</td>
              <td class="px-4 py-3">{{ product.recyclability_pct }}%</td>
              <td class="px-4 py-3">
                <span v-if="typeof product.circular_score === 'number'">
                  {{ product.circular_score.toFixed(1) }}%
                </span>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-3">
                <button class="text-blue-600 hover:underline flex items-center gap-1">
                  <Eye class="w-4 h-4" /> View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Search, Filter, Package, Eye, Info, AlertCircle } from 'lucide-vue-next'

const { products, addProduct, loading, error, fetchProducts } = useProducts()

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const successMessage = ref('')

const showAddDialog = ref(false)
const newProduct = ref({
  name: '',
  sku_code: '',
  material: '',
  weight_grams: 0,
  recycled_weight: 0,
  recyclability_pct: 0,
  reuse_pct: 0
})

// Mapping of material to typical recyclability percentage
const materialRecyclability = {
  rPET: 90,
  PLA: 30,
  HDPE: 95,
  PP: 80
}

// Form validation: ensure all required fields are filled and recycled_weight <= weight_grams
const isFormValid = computed(() => {
  return (
    newProduct.value.name &&
    newProduct.value.sku_code &&
    newProduct.value.material &&
    newProduct.value.weight_grams > 0 &&
    newProduct.value.recycled_weight >= 0 &&
    newProduct.value.recycled_weight <= newProduct.value.weight_grams &&
    newProduct.value.recyclability_pct >= 0 &&
    newProduct.value.recyclability_pct <= 100
  )
})

// Computed recycled percentage for display
const recycledPctComputed = computed(() => {
  return newProduct.value.weight_grams > 0
    ? Math.round((newProduct.value.recycled_weight / newProduct.value.weight_grams) * 100)
    : 0
})

// Computed default recyclability for selected material
const recyclabilityDefault = computed(() => {
  return materialRecyclability[newProduct.value.material] ?? null
})

async function handleAddProduct() {
  // Fetch company_id for the current user
  const { data: userCompany, error: companyError } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.value.id)
    .maybeSingle()

  if (companyError || !userCompany?.company_id) {
    alert('Could not determine your company. Please contact support.')
    return
  }

  // Only send fields that exist in the products table schema
  const { error: addError } = await addProduct({
    ...newProduct.value,
    company_id: userCompany.company_id
  })

  if (!addError) {
    successMessage.value = 'Product added successfully!'
    showAddDialog.value = false
    setTimeout(() => {
      successMessage.value = ''
    }, 2500)
  }

  newProduct.value = {
    name: '',
    sku_code: '',
    material: '',
    weight_grams: 0,
    recycled_weight: 0,
    recyclability_pct: 0,
    reuse_pct: 0
  }
}

// Auto-fill recyclability_pct when material changes, if user hasn't overridden
watch(
  () => newProduct.value.material,
  (mat) => {
    if (mat && recyclabilityDefault.value !== null && (!newProduct.value.recyclability_pct || newProduct.value.recyclability_pct === 0)) {
      newProduct.value.recyclability_pct = recyclabilityDefault.value
    }
  }
)

// Fetch products from the database when the component mounts
onMounted(() => {
  fetchProducts()
})
</script>
