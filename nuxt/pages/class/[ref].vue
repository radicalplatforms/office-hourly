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
    <li
      v-for="session in sessions"
      :key="session.id"
      class="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div class="min-w-0 flex-auto">
        <div class="flex items-center gap-x-2">
          <div
            :class="[statuses[session.status], 'flex-none rounded-full p-1']"
          >
            <div class="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 class="min-w-0 text-sm font-semibold leading-6 text-neutral">
            <NuxtLink :to="'/session/' + session.ref" class="flex gap-x-2">
              <span class="truncate">
                {{ session.title === "" ? "General OH" : session.title }}
                <span class="text-accent">w/</span>
                {{
                  session.instructors
                    .map(function (val) {
                      return val.first + " " + val.last;
                    })
                    .join(", ")
                }}
              </span>
              <span class="absolute inset-0" />
            </NuxtLink>
          </h2>
        </div>
        <div class="mt-1 flex items-center text-xs leading-5 text-accent">
          <p class="truncate">
            {{
              DateTime.fromISO(session.start).toLocaleString(
                DateTime.DATETIME_MED
              )
            }}
            to
            {{
              DateTime.fromISO(session.end).toLocaleString(DateTime.TIME_SIMPLE)
            }}
          </p>
        </div>
      </div>
      <div
        :class="[
          actions[session.action],
          'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset',
        ]"
      >
        {{ session.action }}
      </div>
      <ChevronRightIcon
        class="h-5 w-5 flex-none text-accent"
        aria-hidden="true"
      />
    </li>
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

const statuses = {
  upcoming: "text-yellow-500 bg-yellow-100/10",
  live: "text-green-400 bg-green-400/10",
  completed: "text-gray-500 bg-gray-100/10",
  cancelled: "text-rose-400 bg-rose-400/10",
};
const actions = {
  Edit: "text-accent bg-gray-600/30 ring-gray-700",
  Join: "text-green-400 bg-green-400/10 ring-green-400/30",
  Review: "text-accent bg-gray-600/30 ring-gray-700",
};
const sessions = [
  {
    ref: "1",
    title: "Jumpstart 1B",
    instructors: [
      {
        first: "Radison",
        last: "Akerman",
      },
    ],
    start: "2021-08-30T18:00:00.000Z",
    end: "2021-08-30T19:00:00.000Z",
    status: "live",
    action: "Join",
  },
  {
    ref: "2",
    title: "",
    instructors: [
      {
        first: "Radison",
        last: "Akerman",
      },
      {
        first: "Leeza",
        last: "Andryushchenko",
      },
    ],
    start: "2021-07-30T11:00:00.000Z",
    end: "2021-07-30T12:00:00.000Z",
    status: "cancelled",
    action: "Review",
  },
  {
    ref: "3",
    title: "Jumpstart 1A",
    instructors: [
      {
        first: "Leeza",
        last: "Andryushchenko",
      },
    ],
    start: "2021-07-01T18:00:00.000Z",
    end: "2021-07-01T19:00:00.000Z",
    status: "completed",
    action: "Review",
  },
];
</script>