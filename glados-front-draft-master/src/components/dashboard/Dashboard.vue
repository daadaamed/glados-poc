<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
      <div class="flex items-center gap-3">
        <button
          class="border px-3 py-2 rounded-md hover:bg-gray-50"
          @click="openCreate">Add entity</button>
        <div class="text-sm text-gray-500">{{ totalText }}</div>
      </div>
    </div>

    <FiltersBar
      :types="types"
      :rooms="rooms"
      :statuses="statuses"
      :filters="filters"
      @change="onFilterChange"
      @clear="onClear" />

    <div
      v-if="loading"
      class="rounded-md border p-6 text-gray-600">Loading entities…</div>
    <div
      v-else-if="error"
      class="rounded-md border p-6 text-red-600">Failed to load entities. Please try again.</div>
    <!-- No entities in DB at all (unfiltered total) -->
    <div
      v-else-if="!loading && !error && totalAll === 0"
      class="flex flex-col items-center justify-center text-center text-gray-600 rounded-md border p-10 min-h-[40vh]">

      <div class="text-2xl font-semibold text-gray-700 mb-2">No entities yet</div>
      <p class="max-w-md">
        You don’t have any entities. Click
        <span class="font-medium">“Add entity”</span> to create your first one.
        When you’re ready, tap the talking button in the bottom-right to
        <span class="font-medium">listen to your entities</span>.
      </p>

      <button
        class="mt-6 border px-4 py-2 rounded-md hover:bg-gray-50"
        @click="openCreate">
        Add entity
      </button>
    </div>
    <div
      v-else
      class="flex flex-col gap-4">
      <div
        v-for="(items, room) in groupedByRoom"
        :key="room"
        class="rounded-lg border overflow-hidden bg-white">
    
        <!-- Room header / toggle -->
        <button
          class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          @click="toggleRoom(room)">
          <div class="flex items-center gap-2">
            <span class="font-semibold">{{ room }}</span>
            <span class="text-xs text-gray-500">({{ items.length }})</span>
          </div>
          <span :class="['transition-transform', isOpen(room) ? 'rotate-0' : '-rotate-90']">
            ▾
          </span>
        </button>

        <!-- Room grid -->
        <div
          v-show="isOpen(room)"
          class="px-4 pb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            <EntityCard
              v-for="e in items"
              :key="e.id"
              :entity="e"
              @edit="openEdit"
              @delete="confirmDelete" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <EntityForm
      v-if="showForm"
      :entity="editing"
      :types="types"
      :statuses="statuses"
      :rooms="rooms"
      @cancel="closeForm"
      @submit="saveEntity" />
  </div>
  <ChatTalkButton />
</template>

<script>
import { mapGetters, mapState } from "vuex"
import ChatTalkButton from "@/components/speech/ChatTalkButton.vue"
import EntityCard from "@/components/dashboard/EntityCard.vue"
import EntityForm from "@/components/dashboard/EntityForm.vue"
import FiltersBar from "@/components/dashboard/FiltersBar.vue"
export default {
  name: "Dashboard",
  components: {
    FiltersBar,
    EntityCard,
    EntityForm,
    ChatTalkButton
    
  },
  data() {
    return {
      showForm: false,
      editing: null,
      openByRoom: {}
    }
  },
  created() {
    this.$store.dispatch("loadEntities")
  },
  computed: {
    ...mapState(["filters", "loading", "error", "totalAll"]),
    ...mapGetters(["filteredEntities", "rooms", "types", "statuses"]),
    totalCount() { return this.$store.state.entities.length },
    onCountShown() { return this.filteredEntities.filter(e => e.status === "on").length },
    totalText() {
      const shown = this.filteredEntities.length
      const total = this.totalAll
      const onShown = this.onCountShown
      const entitiesWord = shown === 1 ? "entity" : "entities"
      return `Viewing ${shown} of ${total} ${entitiesWord} • ${onShown} on`
    },
    groupedByRoom() {
      const map = {}
      const label = e => e.room || "Unknown room"
      this.filteredEntities.forEach(e => {
        const r = label(e)
        if (!map[r]) map[r] = []
        map[r].push(e)
      })
      // return sorted by room name
      return Object.fromEntries(
        Object.keys(map).sort().map(k => [k, map[k]])
      )
    },
  },
  methods: {
    onFilterChange({ key, value }) { this.$store.commit("setFilter", {
      key,
      value 
    }); this.$store.dispatch("loadEntities") },
    onClear() { this.$store.commit("clearFilters"); this.$store.dispatch("loadEntities") },

    openCreate() { this.editing = null; this.showForm = true },
    openEdit(entity) { this.editing = entity; this.showForm = true },
    closeForm() { this.showForm = false; this.editing = null },

    async saveEntity(payload) {
      try {
        if (this.editing) {
          await this.$store.dispatch("updateEntity", {
            id: this.editing.id,
            payload
          })
        } else {
          await this.$store.dispatch("createEntity", payload)
        }
        this.closeForm() 
      } catch (err) {
        // Toast already shown by store action
        // Keep form open so user can fix errors
      }
    },

    async confirmDelete(entity) {
      if (window.confirm(`Delete "${entity.name}"?`)) {
        try {
          await this.$store.dispatch("deleteEntity", entity.id)
        } catch (err) {
          // Toast already shown by store action
        }
      }
    },
    isOpen(room) {
      // default to open if not set
      return this.openByRoom[room] !== false
    },
    toggleRoom(room) {
      if (this.$set) {
        this.$set(this.openByRoom, room, !this.isOpen(room))
      } else {
        this.openByRoom = {
          ...this.openByRoom,
          [room]: !this.isOpen(room)
        }
      }
    }
  }
}
</script>
