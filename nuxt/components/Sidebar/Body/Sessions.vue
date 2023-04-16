<template>
  <li v-if="sessions?.length > 0">
    <div class="text-xs font-semibold leading-6 text-accent">My Sessions</div>
    <ul role="list" class="-mx-2 mt-2 space-y-1">
      <li v-for="item in sessions" :key="item.title">
        <SidebarBodyButton
          :icon="FolderIcon"
          :title="item.number"
          :desc="item.title"
          :url="'/class/' + item.id"
          :current="false"
        />
      </li>
    </ul>
  </li>
</template>

<script setup>
import { FolderIcon } from "@heroicons/vue/24/outline/index.js";

const props = defineProps({
  sessions: Object,
});
</script>