<template>
  <nav
    class="navbar navbar-dark bgdark fixed-top"
    style="background-color: #a9a9a9"
  >
    <!-- style="background-color: #4078b5 !important" -->
    <ul class="nav d-flex w-100 align-items-center">
      <li class="nav-item px-2 me-auto text-white" style="font-size: 24px">
        Calendar Website
      </li>
      <li class="nav-item px-2">
        <router-link class="nav-link underline" to="/">Home</router-link>
      </li>
      <li class="nav-item px-2" v-if="isAuth">
        <router-link class="nav-link underline" to="/planner"
          >Planner</router-link
        >
      </li>
      <li class="nav-item px-2" v-if="isAdmin">
        <router-link class="nav-link underline" to="/admin/managePatterns"
          >Admin</router-link
        >
      </li>
      <li class="nav-item px-2" v-if="isAuth">
        <button class="nav-link underline" @click="logout">Logout</button>
      </li>
      <li class="nav-item px-2" v-else>
        <router-link class="nav-link underline" to="/login">Login</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default {
  data() {
    return { isAuth: false, isAdmin: false };
  },
  methods: {
    async logout() {
      await signOut(auth);
      this.$router.push("/login");
    },
    updateAuthState() {
      this.isAuth = !!auth.currentUser;

      if (this.isAuth) {
        auth.currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            this.isAdmin = idTokenResult.claims.admin;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.isAdmin = false;
      }
    },
  },
  beforeMount() {
    this.updateAuthState();

    onAuthStateChanged(auth, () => {
      this.updateAuthState();
    });
  },
};
</script>

<style scoped>
/* white text with white underline on hover/active */
.underline {
  background: transparent;
  border-width: 0px;
  /* border-top: 4px solid transparent; */
  border-bottom: 3px solid transparent;
  color: white;
  display: inline-block;
  /* padding: 0.1rem 0; */
  padding: 0;
  padding-bottom: 2px;
  border-radius: 0px;
}

.underline:hover,
.underline:active,
.underline.router-link-active {
  border-color: transparent;
  background-color: transparent;
  border-bottom: 3px solid white;
  color: white;
}
</style>
