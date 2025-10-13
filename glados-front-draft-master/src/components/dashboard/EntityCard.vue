<template>
  <div class="rounded-xl border p-4 shadow-sm bg-white h-full min-h-40 flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span
          class="text-xl"
          :title="entity.type">{{ icon }}</span>
        <span class="font-semibold">{{ entity.name }}</span>
      </div>
      <span :class="statusBadgeClass">{{ entity.status }}</span>
    </div>

    <div class="text-sm text-gray-600 space-y-1 mt-1 flex-1">
      <div v-if="entity.value !== null">Value: <span class="font-medium">{{ entity.value }}</span></div>
      <div v-if="entity.room !== null">Room: <span class="font-medium">{{ entity.room }}</span></div>
    </div>

    <div class="pt-3 mt-auto flex items-center justify-between gap-2">
      <span class="text-xs text-gray-400">Updated: {{ formattedDate }}</span>
      <div class="flex gap-2">
        <button
          class="border px-3 py-1 rounded-md hover:bg-gray-50"
          @click="$emit('edit', entity)">Edit</button>
        <button
          class="border px-3 py-1 rounded-md hover:bg-red-50 text-red-600"
          @click="$emit('delete', entity)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EntityCard",
  props: {
    entity: {
      type: Object,
      required: true 
    } 
  },
  computed: {
    icon() {
      const map = {
        light: "💡",
        sensor: "🎛️",
        switch: "🔀",
        multimedia: "📺",
        air_conditioner: "❄️" 
      }
      return map[this.entity.type] || "🔧"
    },
    formattedDate() {
      const now = new Date()
      const created = new Date(this.entity.created_at)
      const diffMs = now - created
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return "today"
      if (diffDays === 1) return "yesterday"
      if (diffDays < 30) return `${diffDays} days ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      const years = Math.floor(diffDays / 365)
      return `${years} ${years > 1 ? "years" : "year"} ago`
    },
    statusBadgeClass() {
      const base = "text-xs px-2 py-1 rounded-full capitalize"
      if (this.entity.status === "on") return `${base} bg-green-100 text-green-700`
      if (this.entity.status === "off") return `${base} bg-gray-100 text-gray-700`
      return `${base} bg-yellow-100 text-yellow-700`
    }
  }
}
</script>
