<template>
  <div
    class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 ring-1 ring-accent/5"
  >
    <div class="flex h-16 shrink-0 items-center">
      <img
        class="mt-4 h-7 w-auto"
        src="https://imagedelivery.net/5zM6Rdl2uV8Hmr9WxRh20g/7bbf62eb-c79e-41ef-f2fb-caab76dc6700/md"
        alt="Your Company"
      />
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <SidebarBodyClasses :classes="classes" />
        <SidebarBodySessions :sessions="sessions" />
        <SidebarBodyTickets :tickets="tickets" />
        <SidebarBodyUser :userAuthor="userAuthor" />
      </ul>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  classes: Object,
  sessions: Object,
  tickets: Object,
  userAuthor: Object,
});
</script>