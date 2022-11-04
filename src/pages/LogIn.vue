<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script>
import { EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    // https://github.com/firebase/firebaseui-web/issues/216
    var ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    var uiConfig = {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          // Handle sign-in.
          // https://michaelnthiessen.com/redirect-in-vue
          // https://stackoverflow.com/questions/35914069/how-can-i-get-query-parameters-from-a-url-in-vue-js
          this.$router.push(this.$route.query.redirect || "/planner");
          // Return false to avoid redirect.
          return false;
        },
      },
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
