<template>
  <li v-if="tickets?.length > 0">
    <div class="text-xs font-semibold leading-6 text-accent">My Tickets</div>
    <ul role="list" class="-mx-2 mt-2 space-y-1">
      <li v-for="item in tickets" :key="item.title">
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
  tickets: Object,
});
</script>