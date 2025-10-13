import { createStore } from "vuex"
import mockEntities from "@/mocks/entities"

export default createStore({
  state: {
    entities: [],
    filters: {
      type: "",
      room: "",
      status: ""
    },
    loading: false
  },
  getters: {
    rooms(state) {
      const set = new Set(state.entities.map(e => e.room).filter(Boolean))
      return Array.from(set).sort()
    },
    types() {
      return ["sensor", "light", "switch", "multimedia", "air_conditioner"]
    },
    statuses() {
      return ["on", "off", "unavailable"]
    },
    filteredEntities(state) {
      return state.entities.filter(e => {
        const byType = state.filters.type ? e.type === state.filters.type : true
        const byRoom = state.filters.room ? e.room === state.filters.room : true
        const byStatus = state.filters.status ? e.status === state.filters.status : true
        return byType && byRoom && byStatus
      })
    }
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value
    },
    setEntities(state, payload) {
      state.entities = payload
    },
    setFilter(state, { key, value }) {
      state.filters[key] = value
    },
    clearFilters(state) {
      state.filters = {
        type: "",
        room: "",
        status: "" 
      }
    }
  },
  actions: {
    // For now, load hardcoded data; next step: swap with API
    async loadEntities({ commit }) {
      try {
        commit("setEntities", mockEntities)
      } catch (error) {
        console.error("Failed to load entities:", error)
      } finally {
        commit("setLoading", false)
      }
    }
  },
  modules: {},
})
