<template>
  <li>
    <ul role="list" class="-mx-2 space-y-1">
      <li v-for="item in classes" :key="item.title">
        <a
          :href="item.href"
          :class="[
            item.current
              ? 'bg-primary-focus text-neutral'
              : 'text-accent hover:text-neutral hover:bg-primary-focus',
            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
          ]"
        >
          <component
            :is="item.icon"
            class="h-6 w-6 shrink-0"
            aria-hidden="true"
          />
          {{ item.number }}
        </a>
      </li>
    </ul>
  </li>
</template>

<script setup>
const props = defineProps({
  classes: Object,
});
</script>