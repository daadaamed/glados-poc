import coreApiClient from "@/providers/core-api/CoreApi"

export default {
  getEntities(params = {}) {
    return coreApiClient.sendRequest("get", "/entities", params)
  },
  getEntity(id) {
    return coreApiClient.sendRequest("get", `/entities/${id}`, {})
  },
  createEntity(payload) {
    // { name, type, status, value?, room? }
    return coreApiClient.sendRequest("post", "/entities", payload)
  },
  updateEntity(id, payload) {
    // any subset of fields
    return coreApiClient.sendRequest("put", `/entities/${id}`, payload)
  },
  deleteEntity(id) {
    return coreApiClient.sendRequest("delete", `/entities/${id}`, {})
  }
}
