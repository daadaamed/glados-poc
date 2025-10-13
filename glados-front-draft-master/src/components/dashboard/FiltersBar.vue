<template>
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col">
      <label class="text-xs text-gray-500 mb-1">Type</label>
      <select
        id="filter-type"
        class="border rounded-md px-3 pr-10 py-3 h-11 text-base min-w-[170px]"
        :value="filters.type"
        @change="emitChange('type', $event.target.value)">
        <option value="">All</option>
        <option
          v-for="t in types"
          :key="t"
          :value="t">
          {{ t }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label class="text-xs text-gray-500 mb-1">Room</label>
      <select
        id="filter-room"
        class="border rounded-md px-3 pr-10 py-3 h-11 text-base min-w-[170px]"
        :value="filters.room"
        @change="emitChange('room', $event.target.value)">
        <option value="">Toutes</option>
        <option
          v-for="r in rooms"
          :key="r"
          :value="r">
          {{ r }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label class="text-xs text-gray-500 mb-1">Status</label>
      <select
        id="filter-status"
        class="border rounded-md px-3 pr-10 py-3 h-11 text-base min-w-[170px]"
        :value="filters.status"
        @change="emitChange('status', $event.target.value)">
        <option value="">All</option>
        <option
          v-for="s in statuses"
          :key="s"
          :value="s">
          {{ s }}
        </option>
      </select>
    </div>

    <button
      class="ml-auto border px-3 py-2 rounded-md hover:bg-gray-50"
      aria-label="Réinitialiser les filtres"
      @click="$emit('clear')">
      Reset filters
    </button>
  </div>
</template>

<script>
export default {
  name: "FiltersBar",
  props: {
    types: {
      type: Array,
      default: () => [] 
    },
    rooms: {
      type: Array,
      default: () => [] 
    },
    statuses: {
      type: Array,
      default: () => [] 
    },
    filters: {
      type: Object,
      required: true 
    }
  },
  methods: {
    emitChange(key, value) {
      this.$emit("change", {
        key,
        value 
      })
    }
  }
}
</script>
