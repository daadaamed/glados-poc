import coreApi from "@/providers/core-api"
import { createStore } from "vuex"

export default createStore({
  state: {
    entities: [],
    filters: {
      type: "",
      room: "",
      status: ""
    },
    loading: false,
    error: null,
    totalAll: 0,
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
    setError(state, e) { state.error = e },
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
    },
    setTotalAll(state, n) { state.totalAll = n },
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

        const [data, all] = await Promise.all([
          coreApi.glados.getEntities(params),
          coreApi.glados.getEntities({})     // unfiltered for total
        ])
        commit("setEntities", data)
        commit("setTotalAll", Array.isArray(all) ? all.length : 0)
      } catch (err) {
        console.error(err)
        commit("setError", err?.data || err)
        commit("setEntities", [])
        commit("setTotalAll", 0)
      } finally {
        commit("setLoading", false)
      }
    },

    async createEntity({ dispatch, commit }, payload) {
      commit("setError", null)
      await coreApi.glados.createEntity(payload)
      await dispatch("loadEntities")
    },

    async updateEntity({ dispatch, commit }, { id, payload }) {
      commit("setError", null)
      await coreApi.glados.updateEntity(id, payload)
      await dispatch("loadEntities")
    },

    async deleteEntity({ dispatch, commit }, id) {
      commit("setError", null)
      await coreApi.glados.deleteEntity(id)
      await dispatch("loadEntities")
    }
  },
  modules: {},
})
