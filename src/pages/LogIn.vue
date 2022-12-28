<template>
  <div class="container">
    <form @submit.prevent="login" class="text-start">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
        />
        <div class="text-end">
          <a id="forgot-password" href="/forgot">Forgot password?</a>
        </div>
      </div>
      <div class="text-center">
        <div class="text-danger fw-bold mb-3">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-outline-primary mb-3">
          Log in
        </button>
        <div class="mb-3">New user? <a href="/signup">Sign up</a>.</div>
      </div>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        this.errorMessage = "All fields are required.";
        return;
      }

      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => this.$router.push(this.$route.query.redirect || "/planner"))
        .catch(() => (this.errorMessage = "Invalid email or password."));
    },
  },
};
</script>
