<template>
  <div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details for sustainability tracking</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="addProduct">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Product Name</label>
                <input v-model="newProduct.name" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">SKU Code</label>
                <input v-model="newProduct.sku_code" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Material</label>
                <input v-model="newProduct.material" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Weight (grams)</label>
                <input v-model.number="newProduct.weight_grams" type="number" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Recycled %</label>
                <input v-model.number="newProduct.recycled_pct" type="number" min="0" max="100" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Recyclability %</label>
                <input v-model.number="newProduct.recyclability_pct" type="number" min="0" max="100" class="border rounded-lg py-2 px-3 w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Reuse %</label>
                <input v-model.number="newProduct.reuse_pct" type="number" min="0" max="100" class="border rounded-lg py-2 px-3 w-full" />
              </div>
              <button type="submit" class="w-full bg-[#28A745] hover:bg-[#14532D] text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <Plus class="w-4 h-4 mr-2" />
                Add Product
              </button>
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
              <th class="font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
              <td class="font-medium flex items-center gap-2">
                <Package class="w-4 h-4 text-green-700" />
                {{ product.name }}
              </td>
              <td>{{ product.sku_code }}</td>
              <td>{{ product.material }}</td>
              <td>{{ product.weight_grams }}g</td>
              <td>{{ product.recycled_pct }}%</td>
              <td>{{ product.recyclability_pct }}%</td>
              <td>
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
import { ref } from 'vue'
import { Plus, Search, Filter, Package, Eye } from 'lucide-vue-next'

const products = ref([
  {
    id: '1',
    name: 'Eco Water Bottle',
    sku_code: 'EWB-001',
    material: 'rPET',
    weight_grams: 25,
    recycled_pct: 75,
    recyclability_pct: 95,
    reuse_pct: 85
  },
  {
    id: '2',
    name: 'Biodegradable Food Container',
    sku_code: 'BFC-002',
    material: 'PLA',
    weight_grams: 45,
    recycled_pct: 0,
    recyclability_pct: 60,
    reuse_pct: 40
  }
])

const showAddDialog = ref(false)
const newProduct = ref({
  name: '',
  sku_code: '',
  material: '',
  weight_grams: 0,
  recycled_pct: 0,
  recyclability_pct: 0,
  reuse_pct: 0
})

function addProduct() {
  products.value.push({
    id: String(Date.now()),
    ...newProduct.value
  })
  showAddDialog.value = false
  newProduct.value = {
    name: '',
    sku_code: '',
    material: '',
    weight_grams: 0,
    recycled_pct: 0,
    recyclability_pct: 0,
    reuse_pct: 0
  }
}
</script>
