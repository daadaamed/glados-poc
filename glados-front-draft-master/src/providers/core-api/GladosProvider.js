import coreApiClient from "@/providers/core-api/CoreApi"

export default {
  getEntities(params = {}) {
    return coreApiClient.sendRequest("get", "/entities", params)
  },
}
