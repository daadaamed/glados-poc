<template>
  <!-- Floating button -->
  <div class="fixed bottom-6 right-6 z-50">
    <button
      class="rounded-full shadow-lg bg-indigo-600 text-white w-14 h-14 flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      aria-label="Talk"
      @click="toggle">
      🗣️
    </button>

    <!-- Panel -->
    <div
      v-if="open"
      class="mt-3 w-80 bg-white rounded-xl shadow-2xl border p-4">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-semibold">Glados Assistant</h4>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="toggle"
          aria-label="Close">✕</button>
      </div>

      <div
        v-if="!support"
        class="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
        Text-to-speech is not supported in this browser.
      </div>

      <div class="flex flex-col gap-2">
        <button
          class="border px-3 py-2 rounded-md hover:bg-gray-50 text-left disabled:opacity-60"
          @click="sayListAll"
          :disabled="!support || speaking">
          ▶️ List all entities
        </button>

        <button
          class="border px-3 py-2 rounded-md text-left disabled:opacity-60"
          :disabled="true">
          🟢 List items that are ON (coming soon)
        </button>

        <div class="mt-2">
          <label class="text-xs text-gray-500 mb-1 block">Ask Glados (coming soon)</label>
          <div class="flex gap-2">
            <input
              class="border rounded-md px-3 py-2 flex-1"
              placeholder="e.g. Read Living Room only">
            <button
              class="border px-3 py-2 rounded-md disabled:opacity-60"
              disabled>Send</button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <span
          class="text-xs text-gray-500"
          v-if="speaking">Speaking…</span>
        <button
          v-if="speaking"
          class="text-red-600 border px-3 py-1 rounded-md hover:bg-red-50"
          @click="stop">
          Stop
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as tts from "@/utils/tts"
import { mapGetters } from "vuex"

export default {
  name: "ChatTalkButton",
  data() {
    return {
      open: false,
      speaking: false
    }
  },
  computed: {
    ...mapGetters(["filteredEntities"]),
    support() {
      return tts.isSupported()
    }
  },
  methods: {
    toggle() { this.open = !this.open },

    sayListAll() {
      if (!this.support) return
      const list = this.filteredEntities
      if (!list.length) {
        return this.speakChunks([ "No entities to read. Try adjusting the filters." ])
      }

      // Group by room for natural narration
      const byRoom = list.reduce((acc, e) => {
        const key = e.room || "Unknown room"
        if (!acc[key]) acc[key] = []
        acc[key].push(e)
        return acc
      }, {})

      const chunks = []
      chunks.push(`Listing ${list.length} ${list.length === 1 ? "entity" : "entities"}.`)
      Object.keys(byRoom).sort().forEach(room => {
        const items = byRoom[room]
        const parts = items.map(e => {
          const base = `${e.name} is ${e.status}`
          return e.value ? `${base}, value ${e.value}` : base
        })
        // Keep chunks short for better speech pacing
        chunks.push(`${room}: ${parts.join("; ")}.`)
      })

      this.speakChunks(chunks)
    },

    speakChunks(chunks) {
      try {
        this.speaking = true
        tts.speakQueue(chunks, {
          lang: "en-US",
          rate: 1.0,
          pitch: 1.0,
          onEnd: () => { this.speaking = false }
        })
      } catch (e) {
        console.error(e)
        this.speaking = false
      }
    },

    stop() {
      try { tts.cancel() } finally { this.speaking = false }
    }
  }
}
</script>
