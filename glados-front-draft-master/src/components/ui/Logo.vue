<template>
  <div
    class="w-32"
    @mouseover="isHover = true"
    @mouseleave="isHover = false">
    <img
      v-show="isHover"
      :src="LogoActive"
      alt="logo_default_active">
    <img
      v-show="!isHover"
      :src="Logo"
      alt="logo_default">
  </div>
</template>

<script>
import Logo from "@/assets/images/logo/logo_default.svg"
import LogoActive from "@/assets/images/logo/logo_default_active.svg"

export default {
  name: "Logo",
  data() {
    return {
      Logo,
      LogoActive,
      isHover: false
    }
  }
}
</script>