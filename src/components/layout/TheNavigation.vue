<template>
  <nav
    class="navbar navbar-expand-md navbar-dark fixed-top p-0"
    style="background-color: #737373"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"
        ><span
          style="font-family: 'Oooh Baby'; font-weight: 700; font-size: 32px"
        >
          Fun Day Planners
        </span></router-link
      >
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
        style="background-color: #737373"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title text-white" id="offcanvasNavbarLabel">
            <span
              style="
                font-family: 'Oooh Baby';
                font-weight: 700;
                font-size: 32px;
              "
            >
              Fun Day Planners
            </span>
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
            <!-- <li class="nav-item px-2 my-1">
              <router-link class="nav-link underline p-0" to="/"
                >Home</router-link
              >
            </li> -->
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
      this.$router.push("/");
      $(".offcanvas .btn-close").click();
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
      setTimeout(() => $(".offcanvas .btn-close").click(), 10);
    });
  },
};
</script>
