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
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="border px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-100">
                      <span class="sr-only">Actions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01" /></svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openDetail(product)">
                      <Eye class="w-4 h-4 mr-2 text-blue-600" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openEdit(product)">
                      <Package class="w-4 h-4 mr-2 text-yellow-600" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="confirmDelete(product)">
                      <AlertCircle class="w-4 h-4 mr-2 text-red-600" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
  </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Detail View Dialog -->
  <Dialog :open="showDetailDialog" @update:open="showDetailDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedProduct">
          <div class="mb-2"><strong>Name:</strong> {{ selectedProduct.name }}</div>
          <div class="mb-2"><strong>SKU:</strong> {{ selectedProduct.sku_code }}</div>
          <div class="mb-2"><strong>Material:</strong> {{ selectedProduct.material }}</div>
          <div class="mb-2"><strong>Weight:</strong> {{ selectedProduct.weight_grams }}g</div>
          <div class="mb-2"><strong>Recycled %:</strong> {{ selectedProduct.recycled_pct }}%</div>
          <div class="mb-2"><strong>Recyclability %:</strong> {{ selectedProduct.recyclability_pct }}%</div>
          <div class="mb-2"><strong>Reuse %:</strong> {{ selectedProduct.reuse_pct }}%</div>
          <div class="mb-2"><strong>Circular Score:</strong> <span v-if="typeof selectedProduct.circular_score === 'number'">{{ selectedProduct.circular_score.toFixed(1) }}%</span><span v-else>-</span></div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Edit Product Dialog -->
  <Dialog :open="showEditDialog" @update:open="showEditDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleEditProduct">
          <div class="space-y-4">
            <div class="flex flex-col gap-1">
              <Label for="edit-product-name" class="block">Product Name</Label>
              <Input id="edit-product-name" v-model="editProduct.name" required class="w-full border border-gray-300 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="edit-sku-code" class="block">SKU Code</Label>
              <Input id="edit-sku-code" v-model="editProduct.sku_code" required class="w-full border border-gray-300 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="edit-material" class="block">Material</Label>
              <Select v-model="editProduct.material">
                <SelectTrigger id="edit-material" class="w-full border border-gray-300 bg-white">
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
              <Label for="edit-weight-grams" class="block">Weight (grams)</Label>
              <Input id="edit-weight-grams" v-model.number="editProduct.weight_grams" type="number" min="1" required class="w-full border border-gray-300 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="edit-recycled-weight" class="block">Recycled Content (grams)</Label>
              <Input id="edit-recycled-weight" v-model.number="editProduct.recycled_weight" type="number" min="0" :max="editProduct.weight_grams" required class="w-full border border-gray-300 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="edit-recyclability-pct" class="block">Recyclability (%)</Label>
              <Input id="edit-recyclability-pct" v-model.number="editProduct.recyclability_pct" type="number" min="0" max="100" required class="w-full border border-gray-300 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="edit-reuse-pct" class="block">Reuse (%)</Label>
              <Input id="edit-reuse-pct" v-model.number="editProduct.reuse_pct" type="number" min="0" max="100" class="w-full border border-gray-300 bg-white" />
            </div>
            <Button type="submit" class="w-full bg-yellow-500 hover:bg-yellow-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <div v-if="selectedProduct">
          <p>Are you sure you want to delete <strong>{{ selectedProduct.name }}</strong>?</p>
          <div class="flex gap-4 mt-4">
            <Button class="bg-red-600 hover:bg-red-800 text-white" @click="handleDeleteProduct">Delete</Button>
            <Button class="bg-gray-300 hover:bg-gray-400 text-black" @click="showDeleteDialog = false">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  <!-- Dialogs are now at the root, after the Card -->
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Search, Filter, Package, Eye, Info, AlertCircle } from 'lucide-vue-next'

const { products, addProduct, loading, error, fetchProducts, updateProduct, deleteProduct } = useProducts()

// State for detail, edit, and delete dialogs
const showDetailDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedProduct = ref(null)
const editProduct = ref({})

function openDetail(product) {
  selectedProduct.value = { ...product }
  showDetailDialog.value = true
}

function openEdit(product) {
  editProduct.value = { ...product }
  showEditDialog.value = true
}

function confirmDelete(product) {
  selectedProduct.value = { ...product }
  showDeleteDialog.value = true
}

async function handleEditProduct() {
  if (!editProduct.value.id) return
  const { error: updateError } = await updateProduct(editProduct.value)
  if (!updateError) {
    showEditDialog.value = false
    successMessage.value = 'Product updated successfully!'
    fetchProducts()
    setTimeout(() => { successMessage.value = '' }, 2500)
  }
}

async function handleDeleteProduct() {
  if (!selectedProduct.value?.id) return
  const { error: deleteError } = await deleteProduct(selectedProduct.value.id)
  if (!deleteError) {
    showDeleteDialog.value = false
    successMessage.value = 'Product deleted successfully!'
    fetchProducts()
    setTimeout(() => { successMessage.value = '' }, 2500)
  }
}
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
