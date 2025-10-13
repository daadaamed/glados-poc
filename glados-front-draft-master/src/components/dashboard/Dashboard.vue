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
    <div
      v-else-if="filteredEntities.length === 0"
      class="rounded-md border p-6 text-gray-600">No results. Try adjusting the filters.</div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      <EntityCard
        v-for="e in filteredEntities"
        :key="e.id"
        :entity="e"
        @edit="openEdit"
        @delete="confirmDelete" />
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
    }
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
      if (this.editing) {
        await this.$store.dispatch("updateEntity", {
          id: this.editing.id,
          payload 
        })
      } else {
        await this.$store.dispatch("createEntity", payload)
      }
      this.closeForm()
    },

    async confirmDelete(entity) {
      if (window.confirm(`Delete "${entity.name}"?`)) {
        await this.$store.dispatch("deleteEntity", entity.id)
      }
    }
  }
}
</script>
