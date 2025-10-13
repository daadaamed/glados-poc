<template>
  <div class="rounded-xl border p-4 shadow-sm bg-white">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span
          class="text-xl"
          :title="entity.type">{{ icon }}</span>
        <span class="font-semibold">{{ entity.name }}</span>
      </div>
      <span :class="statusBadgeClass">{{ entity.status }}</span>
    </div>

    <div class="text-sm text-gray-600 space-y-1">
      <div v-if="entity.value !== null">Value : <span class="font-medium">{{ entity.value }}</span></div>
      <div>Room : <span class="font-medium">{{ entity.room }}</span></div>
      <div class="text-xs text-gray-400">Created : {{ entity.created_at }}</div>
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
    statusBadgeClass() {
      const base = "text-xs px-2 py-1 rounded-full capitalize"
      if (this.entity.status === "on") return `${base} bg-green-100 text-green-700`
      if (this.entity.status === "off") return `${base} bg-gray-100 text-gray-700`
      return `${base} bg-yellow-100 text-yellow-700` // unavailable
    }
  }
}
</script>
