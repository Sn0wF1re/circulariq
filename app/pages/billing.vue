<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-bold">Billing & Plans</h2>
      <p class="text-gray-600">Manage your subscription and usage</p>
    </div>

    <!-- Current Plan Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge :class="getBillingStatusColor(companyBilling.billing_status)">
              {{ companyBilling.billing_status }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="currentPlan">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">{{ currentPlan.name }} Plan</h3>
                <p class="text-2xl font-bold text-[#28A745]">${{ currentPlan.monthly_price }}/month</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-6">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold">{{ companyBilling.usage.skus_used }}/{{ currentPlan.sku_limit }}</p>
                <p class="text-sm text-gray-600">SKUs Used</p>
                <Progress :value="(companyBilling.usage.skus_used / currentPlan.sku_limit) * 100" class="mt-2" />
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold">{{ companyBilling.usage.users_used }}/{{ currentPlan.user_limit }}</p>
                <p class="text-sm text-gray-600">Users</p>
                <Progress :value="(companyBilling.usage.users_used / currentPlan.user_limit) * 100" class="mt-2" />
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold">{{ companyBilling.usage.reports_generated }}/{{ currentPlan.report_limit }}</p>
                <p class="text-sm text-gray-600">Reports This Month</p>
                <Progress :value="(companyBilling.usage.reports_generated / currentPlan.report_limit) * 100" class="mt-2" />
              </div>
            </div>

            <div class="mt-6">
              <h4 class="font-medium mb-2">Plan Features</h4>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(feature, index) in currentPlan.features" :key="index" class="flex items-center space-x-2">
                  <IconCheckCircle class="w-4 h-4 text-green-600" />
                  <span class="text-sm">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
          <CardDescription>Current billing period</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Billing Period</span>
              <span class="font-medium">
                {{ formatDate(companyBilling.current_period_start) }} - {{ formatDate(companyBilling.current_period_end) }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Next Payment</span>
              <span class="font-medium">{{ formatDate(companyBilling.current_period_end) }}</span>
            </div>
            <div class="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Monthly Total</span>
              <span class="text-[#28A745]">${{ currentPlan?.monthly_price }}</span>
            </div>
          </div>

          <div class="space-y-2 pt-4">
            <Button class="w-full bg-[#28A745] hover:bg-[#14532D]">
              View Invoices
            </Button>
            <Button variant="outline" class="w-full">
              Download Receipt
            </Button>
            <Button variant="outline" class="w-full text-red-600 border-red-300 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Available Plans -->
    <div>
      <h3 class="text-xl font-bold mb-4">Available Plans</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card v-for="plan in billingPlans" :key="plan.id" :class="['relative', plan.id === companyBilling.plan_id ? 'ring-2 ring-[#28A745] bg-green-50' : 'hover:shadow-lg transition-shadow']">
          <div v-if="plan.id === companyBilling.plan_id" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge class="bg-[#28A745] text-white">Current Plan</Badge>
          </div>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
            <div class="text-3xl font-bold text-[#28A745]">
              ${{ plan.monthly_price }}
              <span class="text-base text-gray-600 font-normal">/month</span>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>SKU Limit:</span>
                <span class="font-medium">{{ plan.sku_limit.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>User Limit:</span>
                <span class="font-medium">{{ plan.user_limit }}</span>
              </div>
              <div class="flex justify-between">
                <span>Monthly Reports:</span>
                <span class="font-medium">{{ plan.report_limit }}</span>
              </div>
            </div>
            <Separator />
            <div class="space-y-2">
              <div v-for="(feature, index) in plan.features" :key="index" class="flex items-center space-x-2">
                <IconCheckCircle class="w-4 h-4 text-green-600" />
                <span class="text-sm">{{ feature }}</span>
              </div>
            </div>
            <Button
              class="w-full"
              :class="plan.id === companyBilling.plan_id ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-[#28A745] hover:bg-[#14532D]'"
              :disabled="plan.id === companyBilling.plan_id"
            >
              {{ plan.id === companyBilling.plan_id ? 'Current Plan' : 'Upgrade' }}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Usage Alerts -->
    <!-- Usage Alerts -->
    <div class="mt-6">
      <h3 class="text-lg font-bold mb-2">Usage Alerts</h3>
      <p class="text-gray-600 mb-4">Monitor your plan limits</p>
      <div v-if="usageAlerts.length > 0" class="flex flex-col gap-4">
        <div
          v-for="(alert, index) in usageAlerts"
          :key="index"
          class="flex items-start gap-3 p-4 rounded-lg bg-yellow-50"
        >
          <IconAlertTriangle class="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
          <div>
            <div class="font-semibold text-yellow-900">Usage Warning</div>
            <div class="text-sm text-yellow-800">{{ alert.message }}</div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <div class="flex flex-col items-center">
          <IconCheckCircle class="w-12 h-12 text-green-600 mb-2" />
          <p class="text-gray-600">All usage levels are within normal limits</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { CheckCircle as IconCheckCircle, AlertTriangle as IconAlertTriangle } from 'lucide-vue-next'

const { billingPlans, companyBilling, loading, error, refresh } = useBilling()
const currentPlan = computed(() => billingPlans.value.find(p => p.id === companyBilling.value.plan_id))


function getBillingStatusColor(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-800'
  if (status === 'Pending') return 'bg-yellow-100 text-yellow-800'
  if (status === 'Cancelled') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}


const usageAlerts = computed(() => {
  const alerts: { message: string }[] = []
  if (!currentPlan.value) return alerts
  const skuUsage = (companyBilling.value.usage.skus_used / currentPlan.value.sku_limit) * 100
  const userUsage = (companyBilling.value.usage.users_used / currentPlan.value.user_limit) * 100
  const reportUsage = (companyBilling.value.usage.reports_generated / currentPlan.value.report_limit) * 100
  if (skuUsage >= 80) alerts.push({ message: `You've used ${Math.round(skuUsage)}% of your SKU limit` })
  if (userUsage >= 80) alerts.push({ message: `You've used ${Math.round(userUsage)}% of your user limit` })
  if (reportUsage >= 80) alerts.push({ message: `You've used ${Math.round(reportUsage)}% of your monthly report limit` })
  return alerts
})
</script>
