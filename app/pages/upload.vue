<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold">Data Upload</h2>
      <p class="text-gray-600">Import product data and sustainability metrics</p>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Individual Product Entry -->
      <Card>
        <CardHeader>
          <CardTitle>Individual Product Entry</CardTitle>
          <CardDescription>Add a single product using a form</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="individual-product-name">Product Name</Label>
            <Input id="individual-product-name" v-model="form.name" placeholder="Enter product name" />
          </div>
          <div>
            <Label for="individual-sku">SKU Code</Label>
            <Input id="individual-sku" v-model="form.sku" placeholder="Enter SKU code" />
          </div>
          <div>
            <Label for="individual-material">Material Type</Label>
            <Select v-model="form.material">
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pet">PET</SelectItem>
                <SelectItem value="rpet">rPET</SelectItem>
                <SelectItem value="pla">PLA</SelectItem>
                <SelectItem value="hdpe">HDPE</SelectItem>
                <SelectItem value="pp">PP</SelectItem>
                <SelectItem value="ps">PS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="individual-weight">Weight (grams)</Label>
            <Input id="individual-weight" v-model="form.weight" type="number" placeholder="Enter weight in grams" />
          </div>
          <div>
            <Label for="individual-recycled">Recycled Content (%)</Label>
            <Input id="individual-recycled" v-model="form.recycled_pct" type="number" min="0" max="100" placeholder="Enter percentage" />
          </div>
          <div>
            <Label for="individual-recyclability">Recyclability (%)</Label>
            <Input id="individual-recyclability" v-model="form.recyclability_pct" type="number" min="0" max="100" placeholder="Enter percentage" />
          </div>
          <Button class="w-full bg-[#28A745] hover:bg-[#14532D]" @click="addProduct">
            <Icon name="plus" class="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CardContent>
      </Card>

      <!-- Bulk File Upload -->
      <Card>
        <CardHeader>
          <CardTitle>Bulk File Upload</CardTitle>
          <CardDescription>Upload CSV or Excel files with multiple products</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Icon name="upload" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p class="text-sm text-gray-600 mb-4">
              Supports CSV, Excel (.xlsx), and JSON formats
            </p>
            <input type="file" class="hidden" ref="fileInput" @change="onFileChange" multiple />
            <Button class="bg-[#28A745] hover:bg-[#14532D]" @click="triggerFileInput">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Upload History -->
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recent file uploads and processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p class="font-medium">products_q1_2024.csv</p>
                <p class="text-sm text-gray-600">Uploaded 2 hours ago</p>
              </div>
              <Badge class="bg-green-100 text-green-800 flex items-center">
                <Icon name="check-circle" class="w-3 h-3 mr-1" />
                Processed
              </Badge>
            </div>
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p class="font-medium">sustainability_metrics.xlsx</p>
                <p class="text-sm text-gray-600">Uploaded 1 day ago</p>
              </div>
              <Badge class="bg-yellow-100 text-yellow-800">Processing</Badge>
            </div>
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p class="font-medium">compliance_data.csv</p>
                <p class="text-sm text-gray-600">Uploaded 3 days ago</p>
              </div>
              <Badge class="bg-red-100 text-red-800 flex items-center">
                <Icon name="alert-triangle" class="w-3 h-3 mr-1" />
                Error
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Data Templates -->
    <Card>
      <CardHeader>
        <CardTitle>Data Templates</CardTitle>
        <CardDescription>Download templates to ensure proper data formatting</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" class="h-auto p-4 flex flex-col items-center space-y-2">
            <Download class="w-6 h-6" />
            <span>Product Template</span>
            <span class="text-xs text-gray-500">CSV format</span>
          </Button>
          <Button variant="outline" class="h-auto p-4 flex flex-col items-center space-y-2">
            <Download class="w-6 h-6" />
            <span>Compliance Template</span>
            <span class="text-xs text-gray-500">Excel format</span>
          </Button>
          <Button variant="outline" class="h-auto p-4 flex flex-col items-center space-y-2">
            <Download class="w-6 h-6" />
            <span>Footprint Template</span>
            <span class="text-xs text-gray-500">JSON format</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Download } from 'lucide-vue-next'
const { uploadHistory, loading, error, refresh, uploadFile, addProduct } = useUploads({ useMock: false })

const form = reactive({
  name: '',
  sku: '',
  material: '',
  weight: '',
  recycled_pct: '',
  recyclability_pct: ''
})

const fileInput = ref<HTMLInputElement | null>(null)

async function addProductHandler() {
  await addProduct({ ...form })
  form.name = ''
  form.sku = ''
  form.material = ''
  form.weight = ''
  form.recycled_pct = ''
  form.recyclability_pct = ''
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    await uploadFile(file)
  }
  (e.target as HTMLInputElement).value = ''
}
</script>
