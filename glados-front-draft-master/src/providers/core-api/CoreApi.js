import BaseApi from "@/providers/BaseApi"

class CoreApi extends BaseApi {
  get baseUrl() {
    return process.env.VUE_APP_CORE_API_URL || "http://localhost:5001"
  }
}

let client = new CoreApi
export default client
