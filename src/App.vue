<template>
  <the-navigation></the-navigation>
  <router-view></router-view>
</template>

<script>
import TheNavigation from "./components/layout/TheNavigation.vue";

export default {
  name: "App",
  components: { TheNavigation },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Amatic+SC:wght@400;700&family=Atma&family=Barrio&family=Birthstone+Bounce&family=Bonbon&family=Butterfly+Kids&family=Codystar&family=Fredericka+the+Great&family=Hachi+Maru+Pop&family=Just+Another+Hand&family=Londrina+Outline&family=Luckiest+Guy&family=Ms+Madi&family=Nanum+Pen+Script&family=Oooh+Baby&family=Permanent+Marker&family=Ribeye+Marrow&family=Rochester&family=Rock+Salt&family=Sacramento&family=Send+Flowers&family=Shadows+Into+Light+Two&family=Special+Elite&family=Unkempt&family=Waiting+for+the+Sunrise&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Color+Emoji");

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app::-webkit-scrollbar {
  display: none;
}

#app {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

main {
  margin-top: 80px;
}

.vert-align-middle {
  vertical-align: middle;
}

.margin-t50 {
  margin-top: 50px;
}

.padding-0 {
  padding: 0;
}

.free-height {
  height: initial;
}

ul {
  list-style-type: circle;
  margin: 0 !important;
  text-align: left;
}

.btn:active,
.btn:hover,
.btn:focus {
  box-shadow: none !important;
}

/* white text with white underline on hover/active */
.underline {
  background: transparent;
  border-width: 0px;
  border-bottom: 3px solid transparent;
  color: white !important;
  display: inline-block;
  padding: 0;
  padding-bottom: 2px;
  border-radius: 0px;
}

.underline:hover,
.underline:active,
.underline.active,
.underline.router-link-active {
  border-color: transparent;
  background-color: transparent;
  border-bottom: 3px solid white !important;
  color: white !important;
}

.underline-primary {
  color: var(--bs-primary) !important;
}

.underline-primary:hover,
.underline-primary:active,
.underline-primary.active,
.underline-primary.router-link-active {
  border-bottom-color: var(--bs-primary) !important;
  color: var(--bs-primary) !important;
}

.underline-secondary {
  color: var(--bs-secondary) !important;
}

.underline-secondary:hover,
.underline-secondary:active,
.underline-secondary.active,
.underline-secondary.router-link-active {
  border-bottom-color: var(--bs-secondary) !important;
  color: var(--bs-secondary) !important;
}

@media print {
  #app {
    margin-top: 0px;
  }

  .noprint {
    display: none !important;
  }
}

@media (max-width: 1280px) {
  .section-title {
    text-align: center;
  }
}
</style>
