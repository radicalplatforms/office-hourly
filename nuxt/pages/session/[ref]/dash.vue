<template>
  <header
    class="flex items-center justify-between border-b border-accent/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
  >
    <h1 class="text-base font-semibold leading-7 text-neutral">
      Session Dashboard
    </h1>
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

  <!-- Stats -->
  <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="(stat, statIdx) in stats"
      :key="stat.name"
      :class="[
        statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
        'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8',
      ]"
    >
      <p class="text-sm font-medium leading-6 text-gray-400">{{ stat.name }}</p>
      <p class="mt-2 flex items-baseline gap-x-2">
        <span class="text-4xl font-semibold tracking-tight text-white">{{
          stat.value
        }}</span>
        <span v-if="stat.unit" class="text-sm text-gray-400">{{
          stat.unit
        }}</span>
      </p>
    </div>
  </div>

  <!-- Activity list -->
  <div class="border-t border-white/10 pt-11">
    <h2
      class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8"
    >
      Latest activity
    </h2>
    <table class="mt-6 w-full whitespace-nowrap text-left">
      <colgroup>
        <col class="w-full sm:w-4/12" />
        <col class="lg:w-4/12" />
        <col class="lg:w-2/12" />
        <col class="lg:w-1/12" />
        <col class="lg:w-1/12" />
      </colgroup>
      <thead class="border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
            User
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
          >
            Commit
          </th>
          <th
            scope="col"
            class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
          >
            Status
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
          >
            Duration
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
          >
            Deployed at
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr v-for="item in activityItems" :key="item.commit">
          <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
            <div class="flex items-center gap-x-4">
              <img
                :src="item.user.imageUrl"
                alt=""
                class="h-8 w-8 rounded-full bg-gray-800"
              />
              <div class="truncate text-sm font-medium leading-6 text-white">
                {{ item.user.name }}
              </div>
            </div>
          </td>
          <td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
            <div class="flex gap-x-3">
              <div class="font-mono text-sm leading-6 text-gray-400">
                {{ item.commit }}
              </div>
              <div
                class="rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10"
              >
                {{ item.branch }}
              </div>
            </div>
          </td>
          <td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
            <div class="flex items-center justify-end gap-x-2 sm:justify-start">
              <time class="text-gray-400 sm:hidden" :datetime="item.dateTime">{{
                item.date
              }}</time>
              <div
                :class="[statuses[item.status], 'flex-none rounded-full p-1']"
              >
                <div class="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <div class="hidden text-white sm:block">{{ item.status }}</div>
            </div>
          </td>
          <td
            class="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20"
          >
            {{ item.duration }}
          </td>
          <td
            class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8"
          >
            <time :datetime="item.dateTime">{{ item.date }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
];

const stats = [
  { name: "Number of deploys", value: "405" },
  { name: "Average deploy time", value: "3.65", unit: "mins" },
  { name: "Number of servers", value: "3" },
  { name: "Success rate", value: "98.5%" },
];

const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "2d89f0c8",
    branch: "main",
    status: "Completed",
    duration: "25s",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];
</script>