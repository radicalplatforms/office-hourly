<template>
  <Html data-theme="dark" />
  <div>
    <!-- Mobile Sidebar -->
    <SidebarMobile
      :classes="classes"
      :userAuthor="userAuthor"
      :sidebarOpen="sidebarOpen"
      @closeSidebar="sidebarOpen = false"
    />

    <!-- Desktop Sidebar -->
    <SidebarBody
      :classes="classes"
      :userAuthor="userAuthor"
      class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col"
    />

    <div class="xl:pl-72">
      <!-- Navbar -->
      <Navbar @openSidebar="sidebarOpen = true" />

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon } from "@heroicons/vue/24/outline";

const config = useRuntimeConfig();

let { auth, isAuth, token, userAuth0, userAuthor } = await getAuth0();

const classes = [
  {
    ref: "1",
    title: "Algorithms I",
    number: "CS 401",
    icon: FolderIcon,
    current: true,
  },
  {
    ref: "2",
    title: "Intro to Networking",
    number: "CS 450",
    icon: FolderIcon,
    current: false,
  },
];

const sidebarOpen = ref(false);
</script>