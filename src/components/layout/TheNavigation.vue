<template>
  <nav
    class="navbar navbar-expand-md navbar-dark fixed-top"
    style="background-color: #a9a9a9"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Calendar Website</router-link>
      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="offcanvas offcanvas-end"
        style="background-color: #a9a9a9"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title text-white" id="offcanvasNavbarLabel">
            Calendar Website
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item px-2 my-1">
              <router-link class="nav-link underline p-0" to="/"
                >Home</router-link
              >
            </li>
            <li class="nav-item px-2 my-1" v-if="isAuth">
              <router-link class="nav-link underline p-0" to="/planner"
                >Planner</router-link
              >
            </li>
            <li class="nav-item px-2 my-1" v-if="isAuth">
              <router-link class="nav-link underline p-0" to="/contactus"
                >Contact Us</router-link
              >
            </li>
            <li class="nav-item px-2 my-1" v-if="isAdmin">
              <router-link
                class="nav-link underline p-0"
                to="/admin/managePatterns"
                >Admin</router-link
              >
            </li>
            <li class="nav-item px-2 my-1" v-if="isAuth">
              <button class="nav-link underline p-0" @click="logout">
                Logout
              </button>
            </li>
            <li class="nav-item px-2 my-1" v-else>
              <router-link class="nav-link underline p-0" to="/login"
                >Login</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import $ from "jquery";

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
  mounted() {
    $(".offcanvas-body a").click(() => {
      $(".offcanvas .btn-close").click();
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
