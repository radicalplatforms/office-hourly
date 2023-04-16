<template>
  <li>
    <div class="text-xs font-semibold leading-6 text-accent">Classes</div>
    <ul role="list" class="-mx-2 mt-2 space-y-1">
      <li v-for="item in classes" :key="item.title">
        <SidebarBodyButton
          :icon="FolderIcon"
          :title="item.Number"
          :desc="item.Title"
          :url="'/class/' + item.ref"
          :current="route.path === '/class/' + item.ref"
        />
      </li>
      <li>
        <SidebarBodyButton
          :icon="SquaresPlusIcon"
          title="Create Class"
          :url="'/class/create'"
          :current="route.path === '/class/create'"
        />
      </li>
    </ul>
  </li>
</template>

<script setup>
import { FolderIcon, SquaresPlusIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  classes: Object,
});
const route = useRoute();
</script>