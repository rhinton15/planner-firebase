<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import "https://fonts.googleapis.com/css2?family=Montserrat&family=Petit+Formal+Script&family=Roboto&family=Roboto+Slab:wght@300&display=swap";
/* @import "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap"; */
@import "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Cookie&family=Homemade+Apple&family=Ms+Madi&family=Rouge+Script&family=Sacramento&family=Shadows+Into+Light&family=Shadows+Into+Light+Two&family=Sue+Ellen+Francisco&family=Tillana&display=swap";
/* @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"; */

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
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

.page-title {
  font-family: "Roboto Slab", serif;
  font-size: 35px;
  -webkit-print-color-adjust: exact;
}

.section-title {
  font-family: "Petit Formal Script", cursive;
  font-size: 30px;
}

.section-body {
  font-family: "Montserrat", sans-serif;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
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
  /* padding: 0 !important; */
  list-style-type: circle;
  margin: 0 !important;
  text-align: left;
}

li {
  /* list-style: none; */
}

.btn:active,
.btn:hover,
.btn:focus {
  box-shadow: none !important;
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
