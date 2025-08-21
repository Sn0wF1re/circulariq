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
        <DialogContent class="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details for sustainability tracking</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleAddProduct">
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <Label for="product-name" class="block">Product Name</Label>
                <Input id="product-name" v-model="newProduct.name" placeholder="Enter product name" required class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="sku-code" class="block">SKU Code</Label>
                <Input id="sku-code" v-model="newProduct.sku_code" placeholder="Enter SKU code" required class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="material" class="block">Material</Label>
                <Select v-model="newProduct.material">
                  <SelectTrigger id="material" class="block w-full border border-gray-300 bg-white pl-3">
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
                <Label for="weight-grams" class="block">Weight (grams)</Label>
                <Input id="weight-grams" v-model.number="newProduct.weight_grams" type="number" placeholder="Enter weight in grams" required class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="recycled-pct" class="block">Recycled Content (%)</Label>
                <Input id="recycled-pct" v-model.number="newProduct.recycled_pct" type="number" min="0" max="100" placeholder="Enter percentage" required class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="recyclability-pct" class="block">Recyclability (%)</Label>
                <Input id="recyclability-pct" v-model.number="newProduct.recyclability_pct" type="number" min="0" max="100" placeholder="Enter percentage" required class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <div class="flex flex-col gap-1">
                <Label for="reuse-pct" class="block">Reuse (%)</Label>
                <Input id="reuse-pct" v-model.number="newProduct.reuse_pct" type="number" min="0" max="100" placeholder="Enter percentage" class="block w-full border border-gray-300 bg-white pl-3" />
              </div>
              <Button type="submit" class="w-full bg-[#28A745] hover:bg-[#14532D] text-white py-2 rounded-lg flex items-center justify-center gap-2">
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
                <span v-if="product.compliance_score && product.compliance_score.overall_score !== undefined">
                  {{ product.compliance_score.overall_score }}%
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
import { ref } from 'vue'
import { Plus, Search, Filter, Package, Eye } from 'lucide-vue-next'
const { products, addProduct, loading, error, refresh } = useProducts()

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

async function handleAddProduct() {
  await addProduct({ ...newProduct.value })
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
