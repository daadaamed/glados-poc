<template>
  <div class="flex flex-col gap-5">
    <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
    <ul>
      <li
        v-for="entity in entities"
        :key="entity.id">
        {{ entity.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"

export default {
  name: "Dashboard",
  created() {
    this.getEntities()
  },
  data() {
    return {
      entities: [],
      isLoading: false,
      isError: false 
    }
  },
  methods: { 
    getEntities() {
      this.isLoading = true

      coreApi.glados.getEntities()
        .then((entities) => {
          this.entities = entities
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  } 
}
</script>