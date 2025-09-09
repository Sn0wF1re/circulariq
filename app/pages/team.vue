<template>
  <div class="flex flex-col gap-4 w-full p-4 md:p-6">
    <!-- Header & Invite Button -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2 w-full">
      <div class="w-full md:w-auto">
        <h2 class="text-xl md:text-2xl font-bold">Team Management</h2>
        <p class="text-gray-600 text-sm md:text-base">Manage users and their access permissions</p>
      </div>
      <Dialog v-if="canManageTeam">
        <DialogTrigger asChild>
          <Button class="bg-[#28A745] hover:bg-[#14532D] w-full md:w-auto">
            <IconUserPlus class="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <div class="flex flex-col gap-1">
              <Label for="invite-email">Email Address</Label>
              <Input id="invite-email" type="email" placeholder="Enter email address" />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="invite-role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                  <SelectItem value="manager">Manager - Can edit data</SelectItem>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-1">
              <Label for="invite-message">Personal Message (Optional)</Label>
              <Input id="invite-message" placeholder="Welcome to our sustainability team!" />
            </div>
            <Button class="w-full bg-[#28A745] hover:bg-[#14532D]">
              <IconMail class="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-2 w-full">
      <Card class="w-full">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Users</CardTitle>
          <IconUsers class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ team.length }}</div>
          <p class="text-xs text-muted-foreground">
            {{ activeUsers }} active, {{ pendingUsers }} pending
          </p>
        </CardContent>
      </Card>
      <Card class="w-full">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Admin Users</CardTitle>
          <IconShield class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ adminUsers }}</div>
          <p class="text-xs text-muted-foreground">Full system access</p>
        </CardContent>
      </Card>
      <Card class="w-full">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Pending Invites</CardTitle>
          <IconMail class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ pendingUsers }}</div>
          <p class="text-xs text-muted-foreground">Awaiting response</p>
        </CardContent>
      </Card>
    </div>

    <!-- Team Table: desktop, cards: mobile -->
    <Card class="w-full">
      <CardHeader>
        <div class="flex items-center gap-2 md:gap-4 w-full">
          <div class="relative flex-1 w-full">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              v-model="searchTerm"
              placeholder="Search team members..."
              class="pl-10 w-full"
            />
          </div>
          <Button variant="outline" class="w-full md:w-auto">
            <IconFilter class="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent class="w-full">
        <!-- Desktop Table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium">{{ user.name }}</p>
                    <p class="text-sm text-gray-600">{{ user.email }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :class="getRoleColor(user.role)">{{ user.role }}</Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :class="getStatusColor(user.status)">{{ user.status }}</Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.last_login }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Dialog v-if="canManageTeam">
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <IconMoreVertical class="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage User: {{ user.name }}</DialogTitle>
                        <DialogDescription>
                          Update user role and permissions
                        </DialogDescription>
                      </DialogHeader>
                      <div class="space-y-4">
                        <div>
                          <Label :for="`role-${user.id}`">Role</Label>
                          <Select v-model="user.role">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div class="flex space-x-2">
                          <Button class="flex-1 bg-[#28A745] hover:bg-[#14532D]" @click="updateTeamMember(user.id, { role: user.role })">
                            Update Role
                          </Button>
                          <Button v-if="user.status === 'Pending'" variant="outline" class="flex-1" @click="acceptInvite(user.id)">
                            Accept Invite
                          </Button>
                          <Button v-if="user.status === 'Pending'" variant="outline" class="flex-1" @click="declineInvite(user.id)">
                            Decline Invite
                          </Button>
                        </div>
                        <Button
                          v-if="user.id !== '1'"
                          variant="outline"
                          class="w-full text-red-600 border-red-300 hover:bg-red-50"
                          @click="removeTeamMember(user.id)"
                        >
                          Remove User
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col gap-3 w-full">
          <div v-for="user in filteredUsers" :key="user.id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col gap-2 w-full">
            <div class="flex items-center justify-between w-full">
              <div>
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-xs text-gray-600">{{ user.email }}</p>
              </div>
              <Badge :class="getRoleColor(user.role)">{{ user.role }}</Badge>
            </div>
            <div class="flex flex-col gap-1 text-xs">
              <div><span class="font-medium text-gray-600">Status:</span> <Badge :class="getStatusColor(user.status)">{{ user.status }}</Badge></div>
              <div><span class="font-medium text-gray-600">Last Login:</span> {{ user.last_login }}</div>
            </div>
            <div class="flex gap-2 mt-2">
              <Dialog v-if="canManageTeam">
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconMoreVertical class="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage User: {{ user.name }}</DialogTitle>
                    <DialogDescription>
                      Update user role and permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div class="space-y-4">
                    <div>
                      <Label :for="`role-${user.id}`">Role</Label>
                      <Select v-model="user.role">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex space-x-2">
                      <Button class="flex-1 bg-[#28A745] hover:bg-[#14532D]" @click="updateTeamMember(user.id, { role: user.role })">
                        Update Role
                      </Button>
                      <Button v-if="user.status === 'Pending'" variant="outline" class="flex-1" @click="acceptInvite(user.id)">
                        Accept Invite
                      </Button>
                      <Button v-if="user.status === 'Pending'" variant="outline" class="flex-1" @click="declineInvite(user.id)">
                        Decline Invite
                      </Button>
                    </div>
                    <Button
                      v-if="user.id !== '1'"
                      variant="outline"
                      class="w-full text-red-600 border-red-300 hover:bg-red-50"
                      @click="removeTeamMember(user.id)"
                    >
                      Remove User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserPlus as IconUserPlus, Mail as IconMail, Users as IconUsers, Shield as IconShield, Search as IconSearch, Filter as IconFilter, MoreVertical as IconMoreVertical } from 'lucide-vue-next'

const { team, loading, error, refresh, updateTeamMember, acceptInvite, declineInvite, removeTeamMember } = useTeam({ useMock: false })
const user = useSupabaseUser()
const currentUser = computed(() => team.value.find(u => u.email === user.value?.email))
const canManageTeam = computed(() => {
  const role = currentUser.value?.role
  return role === 'Admin' || role === 'Owner' || role === 'admin' || role === 'owner'
})

const searchTerm = ref('')

const filteredUsers = computed(() => {
  if (!searchTerm.value) return team.value
  return team.value.filter(u =>
    u.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const activeUsers = computed(() => team.value.filter(u => u.status === 'Active').length)
const pendingUsers = computed(() => team.value.filter(u => u.status === 'Pending').length)
const adminUsers = computed(() => team.value.filter(u => u.role === 'Admin').length)

function getRoleColor(role: string) {
  if (role === 'Admin') return 'bg-green-100 text-green-800'
  if (role === 'Manager') return 'bg-blue-100 text-blue-800'
  if (role === 'Viewer') return 'bg-gray-100 text-gray-800'
  return 'bg-gray-100 text-gray-800'
}

function getStatusColor(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-800'
  if (status === 'Pending') return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
