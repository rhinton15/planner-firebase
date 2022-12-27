<template>
  <div>
    <div class="grid pt-5">
      <div class="grid-banner">
        <svg width="100%" height="100%">
          <pattern
            style="transform: scale(1.5)"
            id="pattern-herringbone"
            x="0"
            y="0"
            width="58"
            height="38.666668"
            patternUnits="userSpaceOnUse"
          >
            <path
              style="
                fill: #335170;
                stroke: none;
                stroke-width: 0.264583px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
                fill-opacity: 1;
              "
              d="M 0,0 58,6.0892388e-7 V 38.666668 l -58,-2e-6 z"
              id="path11450"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="M 0,0 V 9.6666664 L 29,38.666666 V 29 Z"
              id="path859"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.242048;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-miterlimit: 4;
                stroke-dasharray: none;
                stroke-opacity: 1;
              "
              d="M 0,19.333333 V 29 l 9.6666664,9.666666 h 9.6666666 z"
              id="path863"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="M 9.6666664,0 H 19.333333 L 29,9.6666664 v 9.6666666 z"
              id="path869"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="M 58,9.6666672 V 19.333334 L 38.666668,38.666668 H 29 Z"
              id="path970"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="m 58,29 v 9.666668 h -9.666666 z"
              id="path974"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="M 58,6.0892388e-7 29,29 V 19.333334 L 48.333334,6.0892388e-7 Z"
              id="path976"
            ></path>
            <path
              style="
                fill: #28415d;
                fill-opacity: 1;
                stroke: none;
                stroke-width: 0.241666px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                stroke-opacity: 1;
              "
              d="M 38.666668,6.0892388e-7 H 29 V 9.6666672 Z"
              id="path980"
            ></path>
          </pattern>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-herringbone)"
          ></rect>
        </svg>
      </div>
      <div class="grid-text text-white text-start mb-2">
        <p
          class="pt-3"
          style="font-family: 'Oooh Baby'; font-weight: 700; font-size: 40px"
        >
          Welcome to Fun Day Planners!
        </p>
        <p style="font-family: 'Unkempt'; font-size: 20px" v-if="!currentUser">
          Sign up to start planning your fun today (btw it's free)
        </p>
        <div class="text-center">
          <button
            class="btn btn-signup"
            @click="$router.push('/login')"
            v-if="!currentUser"
          >
            Sign Up
          </button>
          <!-- #eae2d0 -->
        </div>
        <p style="font-family: 'Unkempt'; font-size: 20px" v-if="currentUser">
          Let's start planning your fun :)
        </p>
        <div class="text-center">
          <button
            class="btn btn-signup"
            @click="$router.push('/planner')"
            v-if="currentUser"
          >
            Go to Planner
          </button>
          <!-- #eae2d0 -->
        </div>
      </div>
      <div class="grid-image">
        <iframe
          class="w-100"
          style="aspect-ratio: 99/63"
          src="https://www.youtube.com/embed/7xduzR_lN-8?autoplay=1&playlist=7xduzR_lN-8&loop=1&controls=0&modestbranding=1&mute=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div
      class="w-100 my-4 text-white p-3"
      style="
        font-family: 'Ribeye Marrow';
        font-size: 30px;
        background-color: #335170;
      "
    >
      Design from scratch or start from a template
      <font-awesome-icon icon="fa-solid fa-arrow-turn-down" />
    </div>
    <div class="mx-5 mb-5">
      <carousel></carousel>
    </div>

    <div
      class="w-100 mt-4 text-white p-3 d-flex"
      style="background-color: #28415d"
    >
      <div class="me-auto p-2 d-inline-block">Fun Day Planners, LLC</div>
      <div class="p-2 d-inline-block">
        <a href="/terms" class="text-white">Terms and Conditions</a>
      </div>
      <div class="p-2 d-inline-block">
        <a href="/privacy" class="text-white">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "../components/Carousel.vue";

import { auth } from "../firebase";

export default {
  components: { Carousel },
  computed: {
    currentUser() {
      return auth.currentUser;
    },
  },
};
</script>

<style scoped>
.btn-signup {
  color: white;
  border-color: white;
}
.btn-signup:hover,
.btn-signup:active {
  color: #335170;
  background-color: white;
}

.grid {
  display: grid;
  grid-template-columns: 20px 1fr 65% 20px;
  grid-template-rows: 40px 1fr 40px;
  column-gap: 6px;
}
.grid-banner {
  grid-column: 1 / span 4;
  grid-row: 2 / span 1;
}
.grid-text {
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
}
.grid-image {
  grid-column: 3 / span 1;
  grid-row: 1 / span 3;
}

@media (max-width: 768px) {
  .grid {
    display: grid;
    grid-template-columns: 20px 1fr 20px;
    grid-template-rows: auto auto 40px;
    row-gap: 6px;
  }
  .grid-banner {
    grid-column: 1 / span 3;
    grid-row: 1 / span 2;
  }
  .grid-text {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
  }
  .grid-image {
    grid-column: 2 / span 1;
    grid-row: 2 / span 2;
  }
}
</style>
