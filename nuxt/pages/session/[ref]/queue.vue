<template>
  <div class="flex h-full items-center sm:px-6">
    <div>
      <div class="space-y-8">
        <div
          class="border-b border-t border-gray-200 bg-primary-focus shadow-sm sm:rounded-lg sm:border"
        >
          <div
            class="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8"
          >
            <div class="sm:flex lg:col-span-7">
              <div class="mt-6 sm:mt-0">
                <h3 class="text-base font-medium text-neutral">
                  Position in Queue
                </h3>
                <h1 class="mt-2 text-4xl font-medium text-neutral">
                  #{{ session.position }}
                </h1>
                <p class="mt-3 text-sm text-accent">
                  Sit tight. You'll be meeting with your instructor soon. Keep
                  an eye on this tab, right before it's your turn, we'll send a
                  confirmation to make sure you're still there.
                </p>
              </div>
            </div>

            <div class="mt-6 lg:col-span-5 lg:mt-0">
              <dl class="grid grid-cols-2 gap-x-6 text-sm">
                <div>
                  <dt class="font-medium text-neutral">Instructors</dt>
                  <dd class="mt-3 text-accent">
                    <span class="block" v-for="item in session.instructors">{{
                      item.first + " " + item.last
                    }}</span>
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-neutral">Start → End Times</dt>
                  <dd class="mt-3 text-accent">
                    <span class="block">{{
                      DateTime.fromISO(session.start).toLocaleString(
                        DateTime.DATETIME_MED
                      )
                    }}</span>
                    <span class="block">{{
                      DateTime.fromISO(session.end).toLocaleString(
                        DateTime.DATETIME_MED
                      )
                    }}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
            <h4 class="sr-only">Status</h4>
            <p class="text-sm font-medium text-neutral">
              Estimated Wait Time: <strong>15 minutes</strong>
            </p>
            <div class="mt-6" aria-hidden="true">
              <div class="overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-secondary"
                  :style="{
                    width: `calc((${session.step} * 2 + 1) / 8 * 100%)`,
                  }"
                />
              </div>
              <div
                class="mt-6 hidden grid-cols-4 text-sm font-medium text-accent sm:grid"
              >
                <div class="text-secondary">Placed in Queue</div>
                <div
                  :class="[
                    session.step > 0 ? 'text-secondary' : '',
                    'text-center',
                  ]"
                >
                  Waiting
                </div>
                <div
                  :class="[
                    session.step > 1 ? 'text-secondary' : '',
                    'text-center',
                  ]"
                >
                  Up Next
                </div>
                <div
                  :class="[
                    session.step > 2 ? 'text-secondary' : '',
                    'text-right',
                  ]"
                >
                  Session Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from "luxon";

definePageMeta({
  middleware: ["enforce-auth"],
  layout: "dash",
});

const session = {
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
  step: 2,
  position: 1,
};
</script>