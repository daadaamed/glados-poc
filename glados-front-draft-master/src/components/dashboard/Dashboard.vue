<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
      <div class="text-sm text-gray-500">{{ totalText }}</div>
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
      class="rounded-md border p-6 text-gray-600">
      Loading entities…
    </div>

    <div
      v-else-if="error"
      class="rounded-md border p-6 text-red-600">
      Failed to load entities. Please try again.
    </div>

    <div
      v-else-if="filteredEntities.length === 0"
      class="rounded-md border p-6 text-gray-600">
      No results. Try adjusting the filters.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      <EntityCard
        v-for="e in filteredEntities"
        :key="e.id"
        :entity="e" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import EntityCard from "@/components/dashboard/EntityCard.vue"
import FiltersBar from "@/components/dashboard/FiltersBar.vue"

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
    ...mapState(["filters", "loading", "error"]),
    ...mapGetters(["filteredEntities", "rooms", "types", "statuses"]),
    totalCount() { return this.$store.state.entities.length },
    totalText() {
      const shown = this.filteredEntities.length
      const total = this.totalCount
      const noun = shown === 1 ? "entity" : "entities"
      return `Showing ${shown} of ${total} ${noun}`
    }
  },
  methods: {
    onFilterChange({ key, value }) {
      this.$store.commit("setFilter", {
        key,
        value 
      })
      this.$store.dispatch("loadEntities")
    },
    onClear() {
      this.$store.commit("clearFilters")
      this.$store.dispatch("loadEntities")
    }
  }
}
</script>
