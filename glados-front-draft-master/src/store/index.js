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
    toast: {
      show: false,
      type: "success",
      title: "",
      message: ""
    }
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
    showToast(state, { type, title, message }) {
      state.toast = {
        show: true,
        type,
        title,
        message 
      }
    },
    hideToast(state) {
      state.toast.show = false
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
        commit("showToast", {
          type: "error",
          title: "Failed to load entities",
          message: "Please try again"
        })
        setTimeout(() => commit("hideToast"), 3000)
      } finally {
        commit("setLoading", false)
      }
    },

    async createEntity({ dispatch, commit }, payload) {
      commit("setError", null)
      try {
        await coreApi.glados.createEntity(payload)
        await dispatch("loadEntities")
        // ADD THIS:
        commit("showToast", {
          type: "success",
          title: "Entity created",
          message: `${payload.name} was created successfully`
        })
        setTimeout(() => commit("hideToast"), 3000)
      } catch (err) {
        commit("showToast", {
          type: "error",
          title: "Failed to create entity",
          message: err?.response?.data?.errors ? "Check form fields" : "Please try again"
        })
        setTimeout(() => commit("hideToast"), 3000)
        throw err // Re-throw so Dashboard knows it failed
      }
    },

    async updateEntity({ dispatch, commit }, { id, payload }) {
      commit("setError", null)
      try {
        await coreApi.glados.updateEntity(id, payload)
        await dispatch("loadEntities")
        commit("showToast", {
          type: "success",
          title: "Entity updated",
          message: `${payload.name} was updated successfully`
        })
        setTimeout(() => commit("hideToast"), 3000)
      } catch (err) {
        commit("showToast", {
          type: "error",
          title: "Failed to update entity",
          message: "Please try again"
        })
        setTimeout(() => commit("hideToast"), 3000)
        throw err
      }
    },

    async deleteEntity({ dispatch, commit }, id) {
      commit("setError", null)
      try {
        await coreApi.glados.deleteEntity(id)
        await dispatch("loadEntities")
        commit("showToast", {
          type: "success",
          title: "Entity deleted",
          message: "Entity was deleted successfully"
        })
        setTimeout(() => commit("hideToast"), 3000)
      } catch (err) {
        commit("showToast", {
          type: "error",
          title: "Failed to delete entity",
          message: "Please try again"
        })
        setTimeout(() => commit("hideToast"), 3000)
        throw err
      }
    }
  },
  modules: {},
})
