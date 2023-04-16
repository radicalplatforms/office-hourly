<template>
  <header
    class="flex items-center justify-between border-b border-accent/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
  >
    <h1 class="text-base font-semibold leading-7 text-neutral">
      Create Section
    </h1>
  </header>

  <Notification
    :show="isIssuesNote"
    title="Invalid Section"
    :desc="
      'We found ' +
      issues.length +
      ' issue' +
      (issues.length === 1 ? '' : 's') +
      ' preventing your section from being saved. Please correct and try again.'
    "
    @close="isIssuesNote = false"
  />

  <div
    class="w-full relative mx-auto max-w-3xl px-6 lg:max-w-7xl lg:px-8 pb-10 pt-6"
  >
    <div class="space-y-6 divide-y divide-neutral">
      <div class="space-y-8 divide-y divide-neutral sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <FormHeader
            title="Section Details"
            desc="This information will be displayed publicly to all students and instructors."
          />

          <div class="space-y-6 sm:space-y-5">
            <div
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-neutral sm:pt-5"
            >
              <label
                for="class"
                class="block text-sm font-medium text-neutral sm:mt-px sm:pt-2"
              >
                Class*
              </label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="class"
                  id="class"
                  v-model="payload.classRef"
                  disabled
                  class="block w-full max-w-lg rounded-md bg-primary-focus border-accent shadow-sm focus:border-secondary focus:ring-secondary sm:max-w-xs sm:text-sm"
                />
                <FormIssues :issues="issues" field="class" />
              </div>
            </div>

            <div
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-neutral sm:pt-5"
            >
              <label
                for="title"
                class="block text-sm font-medium text-neutral sm:mt-px sm:pt-2"
              >
                Title*
              </label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="title"
                  id="title"
                  v-model="payload.title"
                  class="block w-full max-w-lg rounded-md bg-primary-focus border-accent shadow-sm focus:border-secondary focus:ring-secondary sm:max-w-xs sm:text-sm"
                />
                <FormIssues :issues="issues" field="title" />
              </div>
            </div>

            <div
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-neutral sm:pt-5"
            >
              <label
                for="start"
                class="block text-sm font-medium text-neutral sm:mt-px sm:pt-2"
              >
                Start*
              </label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  type="datetime-local"
                  name="start"
                  id="start"
                  v-model="payload.start"
                  class="block w-full max-w-lg pb-1 rounded-md bg-primary-focus border-accent shadow-sm focus:border-secondary focus:ring-secondary sm:max-w-xs sm:text-sm"
                />
                <FormIssues :issues="issues" field="start" />
              </div>
            </div>

            <div
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-neutral sm:pt-5"
            >
              <label
                for="end"
                class="block text-sm font-medium text-neutral sm:mt-px sm:pt-2"
              >
                End*
              </label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  type="datetime-local"
                  name="end"
                  id="end"
                  v-model="payload.end"
                  class="block w-full max-w-lg pb-1 rounded-md bg-primary-focus border-accent shadow-sm focus:border-secondary focus:ring-secondary sm:max-w-xs sm:text-sm"
                />
                <FormIssues :issues="issues" field="end" />
              </div>
            </div>

            <div
              class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-neutral sm:pt-5"
            >
              <label
                for="instructors"
                class="block text-sm font-medium text-neutral sm:mt-px sm:pt-2"
              >
                Instructors*
              </label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <Listbox as="div" v-model="payload.instructors" multiple>
                  <div class="relative w-full max-w-lg sm:max-w-xs">
                    <ListboxButton
                      class="relative w-full cursor-default rounded-md bg-primary-focus py-2 pl-3 pr-10 rounded-md bg-primary-focus border-accent border-[1px] shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                    >
                      <span class="flex items-center">
                        <img
                          v-if="payload.instructors.length === 1"
                          :src="payload.instructors[0]?.profile.pfp"
                          alt=""
                          class="h-5 w-5 flex-shrink-0 rounded-full"
                          :class="{ 'mr-3': payload.instructors.length === 1 }"
                        />
                        <span class="block truncate">{{
                          payload.instructors
                            .map(
                              (person) =>
                                person.profile.first + " " + person.profile.last
                            )
                            .join(", ")
                        }}</span>
                      </span>
                      <span
                        class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
                      >
                        <ChevronUpDownIcon
                          class="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>

                    <transition
                      leave-active-class="transition ease-in duration-100"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0"
                    >
                      <ListboxOptions
                        class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-primary-focus py-1 text-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        <ListboxOption
                          as="template"
                          v-for="person in instructors"
                          :key="person.profile.username"
                          :value="person"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-secondary text-neutral'
                                : 'text-accent',
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                            ]"
                          >
                            <div class="flex items-center">
                              <img
                                :src="person.profile.pfp"
                                alt=""
                                class="h-5 w-5 flex-shrink-0 rounded-full"
                              />
                              <span
                                :class="[
                                  selected ? 'font-semibold' : 'font-normal',
                                  'ml-3 block truncate',
                                ]"
                                >{{
                                  person.profile.first +
                                  " " +
                                  person.profile.last
                                }}</span
                              >
                            </div>

                            <span
                              v-if="selected"
                              :class="[
                                active ? 'text-neutral' : 'text-secondary',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              ]"
                            >
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
                <FormIssues :issues="issues" field="instructors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <div class="flex justify-end">
          <NuxtLink
            to="/classes"
            type="button"
            class="rounded-md border bg-primary-focus border-accent py-2 px-4 text-sm font-medium text-neutral shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Cancel
          </NuxtLink>
          <button
            @click="sendSessionForm"
            type="button"
            class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-neutral shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            :class="{
              'opacity-50 bg-primary-focus hover:bg-primary-focus':
                isSubmitting,
            }"
            :disabled="isSubmitting"
          >
            <svg
              class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              v-if="isSubmitting"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSubmitting ? "Submitting..." : "Everything looks good!" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from "luxon";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid/index.js";

definePageMeta({
  middleware: ["enforce-auth"],
  layout: "dash",
});

const config = useRuntimeConfig();
const route = useRoute();

let { auth, isAuth, token, userAuth0, userAuthor } = await getAuth0();

const issues = reactive([]);

const { data: rawInstructors } = await useFetch("/users/instructor", {
  method: "GET",
  server: false, // not to Nitro
  baseURL: config.urlBase.back, // backend url
  headers: {
    // auth headers
    Authorization: "Bearer " + token,
    ClassRef: route.query.classRef,
  },
});

let payload = reactive({
  classRef: route.query.classRef,
  title: "",
  start: "",
  end: "",
  instructors: [rawInstructors.value[0]],
});

// console.log(payload);
let isCreating = ref(true);
let isSubmitting = ref(false);
let isIssuesNote = ref(false);

let sendSessionForm = async () => {
  isSubmitting.value = true;
  console.log("making body");
  let body = JSON.parse(JSON.stringify(payload));
  body.instructors = body.instructors.map((instructor) => {
    return instructor.profile.username;
  });
  console.log("sending post");
  const { data: createdSession, error } = await useFetch("/sessions", {
    method: isCreating.value ? "POST" : "PUT",
    server: false, // not to Nitro
    baseURL: config.urlBase.back, // backend url
    headers: {
      // auth headers
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
    onResponse({ request, response, options }) {
      return navigateTo("/class/" + response._data.ref);
    },
  });
  console.log(rawInstructors);
  // Reset and construct form field issues
  issues.length = 0;
  if (error.value) {
    console.log(error);
    // Add issues to issues array
    error.value.response._data.error.issues.forEach((issue) => {
      issue.path.forEach((pth) => {
        issues.push({
          field: pth,
          message: issue.message,
        });
      });
    });
    isIssuesNote.value = true;
  } else {
    return navigateTo("/class/" + createdSession.value.ref.id);
  }
  isSubmitting.value = false;
};
</script>