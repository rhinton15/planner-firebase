<template>
  <div>Home!</div>
  <!-- <div>
    Hello {{ getCurrentUser().displayName }}
    <button class="btn btn-outline-primary" @click="logout">Logout</button>
  </div> -->
</template>

<script>
// const fb = require("./../../firebaseConfig.js");
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default {
  methods: {
    getCurrentUser() {
      return getAuth().currentUser;
    },
    async logout() {
      await signOut(getAuth());
      this.$router.push("/login");
    },
  },
};
</script>
