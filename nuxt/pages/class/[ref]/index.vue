<template>
  <header
    class="flex items-center justify-between border-b border-accent/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
  >
    <h1 class="text-base font-semibold leading-7 text-neutral">Sessions</h1>

    <div>
      <NuxtLink
        :to="'/session/create?classRef=' + route.params.ref"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-neutral shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Create Session
      </NuxtLink>
    </div>

    <!-- Sort dropdown -->
    <!--    <Menu as="div" class="relative">-->
    <!--      <MenuButton-->
    <!--        class="flex items-center gap-x-1 text-sm font-medium leading-6 text-neutral"-->
    <!--      >-->
    <!--        Sort by-->
    <!--        <ChevronUpDownIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />-->
    <!--      </MenuButton>-->
    <!--      <transition-->
    <!--        enter-active-class="transition ease-out duration-100"-->
    <!--        enter-from-class="transform opacity-0 scale-95"-->
    <!--        enter-to-class="transform opacity-100 scale-100"-->
    <!--        leave-active-class="transition ease-in duration-75"-->
    <!--        leave-from-class="transform opacity-100 scale-100"-->
    <!--        leave-to-class="transform opacity-0 scale-95"-->
    <!--      >-->
    <!--        <MenuItems-->
    <!--          class="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-primary/5 focus:outline-none"-->
    <!--        >-->
    <!--          <MenuItem v-slot="{ active }">-->
    <!--            <a-->
    <!--              href="#"-->
    <!--              :class="[-->
    <!--                active ? 'bg-gray-50' : '',-->
    <!--                'block px-3 py-1 text-sm leading-6 text-primary',-->
    <!--              ]"-->
    <!--              >Name</a-->
    <!--            >-->
    <!--          </MenuItem>-->
    <!--          <MenuItem v-slot="{ active }">-->
    <!--            <a-->
    <!--              href="#"-->
    <!--              :class="[-->
    <!--                active ? 'bg-gray-50' : '',-->
    <!--                'block px-3 py-1 text-sm leading-6 text-primary',-->
    <!--              ]"-->
    <!--              >Date updated</a-->
    <!--            >-->
    <!--          </MenuItem>-->
    <!--          <MenuItem v-slot="{ active }">-->
    <!--            <a-->
    <!--              href="#"-->
    <!--              :class="[-->
    <!--                active ? 'bg-gray-50' : '',-->
    <!--                'block px-3 py-1 text-sm leading-6 text-primary',-->
    <!--              ]"-->
    <!--              >Environment</a-->
    <!--            >-->
    <!--          </MenuItem>-->
    <!--        </MenuItems>-->
    <!--      </transition>-->
    <!--    </Menu>-->
  </header>

  <!-- Sessions list -->
  <ul role="list" class="divide-y divide-accent/5">
    <Session :sessions="filteredSessions" />
  </ul>
</template>

<script setup>
import { DateTime } from "luxon";
import { ChevronRightIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

definePageMeta({
  middleware: ["enforce-auth"],
  layout: "dash",
});

const config = useRuntimeConfig();
const route = useRoute();

let { auth, isAuth, token, userAuth0, userAuthor } = await getAuth0();

const { data: sessions } = await useFetch("/sessions", {
  method: "GET",
  server: false, // not to Nitro
  baseURL: config.urlBase.back, // backend url
  headers: {
    // auth headers
    Authorization: "Bearer " + token,
  },
});

const filteredSessions = computed(() => {
  return sessions.value.filter((session) => {
    return session.data.Class["@ref"].id === route.params.ref;
  });
});
</script>