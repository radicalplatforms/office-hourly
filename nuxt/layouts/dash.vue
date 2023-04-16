<template>
  <Html data-theme="dark" />
  <div class="h-full">
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
      :sessions="classes"
      :tickets="classes"
      :userAuthor="userAuthor"
      class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col"
    />

    <div class="h-full xl:pl-72">
      <!-- Navbar -->
      <Navbar @openSidebar="sidebarOpen = true" />

      <main class="h-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

let { auth, isAuth, token, userAuth0, userAuthor } = await getAuth0();

const { data: classes } = await useFetch("/classes", {
  method: "GET",
  server: false, // not to Nitro
  baseURL: config.urlBase.back, // backend url
  headers: {
    // auth headers
    Authorization: "Bearer " + token,
  },
});

console.log(classes);

const sidebarOpen = ref(false);
</script>