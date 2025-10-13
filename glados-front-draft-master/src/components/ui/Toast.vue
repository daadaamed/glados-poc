<template>
  <transition name="toast">
    <div
      v-if="show"
      :class="toastClass"
      class="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg max-w-sm z-50 flex items-center gap-3 ">
      <span class="text-xl">{{ icon }}</span>
      <div class="flex-1">
        <div class="font-semibold">{{ title }}</div>
        <div
          v-if="message"
          class="text-sm opacity-90">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  props: {
    show: Boolean,
    type: {
      type: String,
      default: "success",
      validator: v => ["success", "error", "info"].includes(v)
    },
    title: String,
    message: String
  },
  computed: {
    icon() {
      return {
        success: "✓",
        error: "✕",
        info: "ℹ"
      }[this.type]
    },
    toastClass() {
      const base = "text-white"
      return {
        success: `${base} bg-green-600/90`,
        error: `${base} bg-red-600/90`,
        info: `${base} bg-blue-600/90`
      }[this.type]
    }
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  opacity: 0;
}
</style>