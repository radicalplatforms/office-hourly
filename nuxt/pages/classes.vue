<template>
  <Html data-theme="dark" />
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="relative z-50 xl:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <img
                    class="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.title">
                          <a
                            :href="item.href"
                            :class="[
                              item.current
                                ? 'bg-primary-focus text-white'
                                : 'text-gray-400 hover:text-white hover:bg-primary-focus',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.title }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="-mx-6 mt-auto">
                      <a
                        href="#"
                        class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-primary-focus"
                      >
                        <Avatar
                          class="rounded-full flex-shrink-0"
                          :size="32"
                          variant="beam"
                          :name="userAuthor.profile.username"
                          v-if="userAuthor.profile.useBoringAvatars"
                        />
                        <img
                          class="h-8 w-8 rounded-full bg-primary-focus"
                          :src="userAuthor.profile.pfp"
                          alt=""
                          v-else
                        />
                        <span class="sr-only">Your profile</span>
                        <span aria-hidden="true" class="-mt-1">
                          {{ userAuthor.profile.first }}
                          {{ userAuthor.profile.last }}
                          <span class="block text-xs font-medium -mt-0.5">
                            @{{ userAuthor.profile.username }}
                          </span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.title">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-primary-focus text-white'
                        : 'text-gray-400 hover:text-white hover:bg-primary-focus',
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
            <li class="-mx-6 mt-auto">
              <a
                href="#"
                class="flex items-center gap-x-4 px-6 py-4 text-sm font-semibold leading-6 text-white hover:bg-primary-focus"
              >
                <Avatar
                  class="rounded-full flex-shrink-0"
                  :size="32"
                  variant="beam"
                  :name="userAuthor.profile.username"
                  v-if="userAuthor.profile.useBoringAvatars"
                />
                <img
                  class="h-8 w-8 rounded-full bg-primary-focus"
                  :src="userAuthor.profile.pfp"
                  alt=""
                  v-else
                />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true" class="-mt-1">
                  {{ userAuthor.profile.first }}
                  {{ userAuthor.profile.last }}
                  <span class="block text-xs font-medium -mt-0.5">
                    @{{ userAuthor.profile.username }}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="xl:pl-72">
      <!-- Sticky search header -->
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="-m-2.5 p-2.5 text-white xl:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-5 w-5" aria-hidden="true" />
        </button>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="flex flex-1" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="relative w-full">
              <MagnifyingGlassIcon
                class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="search-field"
                class="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
      </div>

      <main>
        <header
          class="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
        >
          <h1 class="text-base font-semibold leading-7 text-white">Sessions</h1>

          <!-- Sort dropdown -->
          <Menu as="div" class="relative">
            <MenuButton
              class="flex items-center gap-x-1 text-sm font-medium leading-6 text-white"
            >
              Sort by
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-3 py-1 text-sm leading-6 text-gray-900',
                    ]"
                    >Name</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-3 py-1 text-sm leading-6 text-gray-900',
                    ]"
                    >Date updated</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-3 py-1 text-sm leading-6 text-gray-900',
                    ]"
                    >Environment</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </header>

        <!-- Deployment list -->
        <ul role="list" class="divide-y divide-white/5">
          <li
            v-for="deployment in deployments"
            :key="deployment.id"
            class="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
          >
            <div class="min-w-0 flex-auto">
              <div class="flex items-center gap-x-3">
                <div
                  :class="[
                    statuses[deployment.status],
                    'flex-none rounded-full p-1',
                  ]"
                >
                  <div class="h-2 w-2 rounded-full bg-current" />
                </div>
                <h2 class="min-w-0 text-sm font-semibold leading-6 text-white">
                  <a :href="deployment.href" class="flex gap-x-2">
                    <span class="truncate">{{ deployment.teamName }}</span>
                    <span class="text-gray-400">/</span>
                    <span class="whitespace-nowrap">{{
                      deployment.projectName
                    }}</span>
                    <span class="absolute inset-0" />
                  </a>
                </h2>
              </div>
              <div
                class="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400"
              >
                <p class="truncate">{{ deployment.description }}</p>
                <svg
                  viewBox="0 0 2 2"
                  class="h-0.5 w-0.5 flex-none fill-gray-300"
                >
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <p class="whitespace-nowrap">{{ deployment.statusText }}</p>
              </div>
            </div>
            <div
              :class="[
                environments[deployment.environment],
                'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset',
              ]"
            >
              {{ deployment.environment }}
            </div>
            <ChevronRightIcon
              class="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script setup>
import Avatar from "vue-boring-avatars";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  Bars3Icon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/20/solid";

definePageMeta({
  middleware: ["enforce-auth"],
});

const config = useRuntimeConfig();

let { auth, isAuth, token, userAuth0, userAuthor } = await getAuth0();

const navigation = [
  {
    title: "Algorithms I",
    number: "CS 401",
    href: "#",
    icon: FolderIcon,
    current: false,
  },
  {
    title: "Intro to Networking",
    number: "CS 450",
    href: "#",
    icon: FolderIcon,
    current: false,
  },
];
const statuses = {
  offline: "text-gray-500 bg-gray-100/10",
  online: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
};
const environments = {
  Preview: "text-gray-400 bg-gray-600/30 ring-gray-700",
  Production: "text-indigo-400 bg-indigo-400/10 ring-indigo-400/30",
};
const deployments = [
  {
    id: 1,
    href: "#",
    projectName: "ios-app",
    teamName: "Planetaria",
    status: "offline",
    statusText: "Initiated 1m 32s ago",
    description: "Deploys from GitHub",
    environment: "Preview",
  },
];

const sidebarOpen = ref(false);
</script>