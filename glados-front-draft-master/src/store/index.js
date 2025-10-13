import { createStore } from "vuex"
import coreApi from "@/providers/core-api"

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
    async loadEntities({ commit, state }) {
      commit("setLoading", true)
      commit("setError", null)
      try {
        const params = {}
        if (state.filters.type) params.type = state.filters.type
        if (state.filters.room) params.room = state.filters.room
        if (state.filters.status) params.status = state.filters.status

        const data = await coreApi.glados.getEntities(params)
        commit("setEntities", data)
      } catch (err) {
        console.error(err)
        commit("setError", err?.data || err)
        commit("setEntities", [])
      } finally {
        commit("setLoading", false)
      }
    }
  },
  modules: {},
})
