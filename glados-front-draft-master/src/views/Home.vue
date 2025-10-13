<template>
  <div class="flex flex-col items-center gap-5 h-full">
    <Header />
    <div class="bg-white rounded-md shadow-lg px-5 py-10 w-full flex-1">
      <router-view />
    </div>
    <Toast
      :show="toast.show"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message" />
  </div>
</template>

<script>
import Header from "@/components/navigations/Header.vue"
import { mapState } from "vuex"
import Toast from "@/components/ui/Toast.vue"

export default {
  name: "Home",
  components: {
    Header,
    Toast 
  },
  computed: { ...mapState(["toast"]) }
}
</script>