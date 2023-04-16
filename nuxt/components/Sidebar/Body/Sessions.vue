<template>
  <li v-if="sessions?.length > 0">
    <div class="text-xs font-semibold leading-6 text-accent">My Sessions</div>
    <ul role="list" class="-mx-2 mt-2 space-y-1">
      <li v-for="item in sessions" :key="item.title">
        <SidebarBodyButton
          :icon="item.icon"
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
const props = defineProps({
  sessions: Object,
});
</script>