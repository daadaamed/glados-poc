<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
      <div class="text-sm text-gray-500">Total: {{ filtered.length }}</div>
    </div>

    <FiltersBar
      :types="types"
      :rooms="rooms"
      :statuses="statuses"
      :filters="filters"
      @change="onFilterChange"
      @clear="onClear" />

    <div
      v-if="filtered.length === 0"
      class="rounded-md border p-6 text-gray-600">
      No entity found with the current filters.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <EntityCard
        v-for="e in filtered"
        :key="e.id"
        :entity="e" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import FiltersBar from "@/components/dashboard/FiltersBar.vue"
import EntityCard from "@/components/dashboard/EntityCard.vue"

export default {
  name: "Dashboard",
  components: {
    FiltersBar,
    EntityCard 
  },
  created() {
    this.$store.dispatch("loadEntities")
  },
  computed: {
    ...mapState(["filters"]),
    ...mapGetters(["filteredEntities", "rooms", "types", "statuses"]),
    filtered() {
      return this.filteredEntities
    }
  },
  methods: {
    onFilterChange({ key, value }) {
      // Auto-apply: commit immediately
      this.$store.commit("setFilter", {
        key,
        value 
      })
    },
    onClear() {
      this.$store.commit("clearFilters")
    }
  }
}
</script>
