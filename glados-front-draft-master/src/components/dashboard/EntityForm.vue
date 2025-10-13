<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ isEdit ? "Edit entity" : "Add entity" }}</h3>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="$emit('cancel')">✕</button>
      </div>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="text-xs text-gray-500 mb-1 block">Name</label>
            <input
              class="border rounded-md px-3 py-2 w-full"
              v-model="form.name"
              required />
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              class="border rounded-md px-3 py-2 w-full"
              v-model="form.type"
              required>
              <option
                v-for="t in types"
                :key="t"
                :value="t">{{ t }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              class="border rounded-md px-3 py-2 w-full"
              v-model="form.status"
              required>
              <option
                v-for="s in statuses"
                :key="s"
                :value="s">{{ s }}</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Value (optional)</label>
            <input
              class="border rounded-md px-3 py-2 w-full"
              v-model="form.value" />
          </div>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Room (optional)</label>
            <select
              class="border rounded-md px-3 py-2 w-full"
              v-model="form.room">
              <option value="">—</option>
              <option
                v-for="r in rooms"
                :key="r"
                :value="r">{{ r }}</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="border px-4 py-2 rounded-md hover:bg-gray-50"
            @click="$emit('cancel')">Cancel</button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            {{ isEdit ? "Save changes" : "Create entity" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EntityForm",
  props: {
    entity: {
      type: Object,
      default: null 
    },
    types: {
      type: Array,
      default: () => [] 
    },
    statuses: {
      type: Array,
      default: () => [] 
    },
    rooms: {
      type: Array,
      default: () => [] 
    },
  },
  data() {
    return {
      form: {
        name: this.entity?.name || "",
        type: this.entity?.type || (this.types[0] || ""),
        status: this.entity?.status || (this.statuses[0] || ""),
        value: this.entity?.value ?? "",
        room: this.entity?.room || "",
      }
    }
  },
  computed: { isEdit() { return !!this.entity } },
  methods: {
    submit() {
      // Send only fields the backend expects (room is name string)
      const payload = {
        name: this.form.name,
        type: this.form.type,
        status: this.form.status,
      }
      if (this.form.value !== "") payload.value = this.form.value
      // Allow clearing room by sending empty string -> parent can pass as-is
      if (this.form.room !== undefined) payload.room = this.form.room || null

      this.$emit("submit", payload)
    }
  }
}
</script>
