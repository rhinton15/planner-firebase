<template>
  <div class="container">
    <form @submit.prevent="signup" class="text-start">
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
      </div>
      <div class="mb-3">
        <label for="repeat-password" class="form-label">Repeat Password</label>
        <input
          type="password"
          class="form-control"
          id="repeat-password"
          v-model="repeatPassword"
        />
      </div>
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="terms-and-privacy"
          v-model="confirmTerms"
        />
        <label class="form-check-label" for="terms-and-privacy"
          >I agree to the
          <a href="/terms" target="_blank">Terms and Conditions</a> and
          <a href="/privacy" target="_blank">Privacy Policy</a></label
        >
      </div>
      <div class="text-center">
        <div class="text-danger fw-bold mb-3">{{ errorMessage }}</div>
        <button
          type="submit"
          class="btn btn-outline-primary mb-3"
          :disabled="!confirmTerms"
        >
          Sign Up
        </button>
        <div class="mb-3">Already registered? <a href="/login">Log in</a>.</div>
      </div>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      confirmTerms: false,
      errorMessage: "",
    };
  },
  methods: {
    signup() {
      if (this.password !== this.repeatPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      if (!this.email || !this.password || !this.repeatPassword) {
        this.errorMessage = "All fields are required.";
        return;
      }

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => this.$router.push(this.$route.query.redirect || "/planner"))
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              this.errorMessage = `Email address ${this.email} already in use.`;
              break;
            case "auth/invalid-email":
              this.errorMessage = `Email address ${this.email} is invalid.`;
              break;
            case "auth/operation-not-allowed":
              this.errorMessage = `Error during sign up.`;
              break;
            case "auth/weak-password":
              this.errorMessage =
                "Password is not strong enough. Add additional characters including special characters and numbers.";
              break;
            default:
              this.errorMessage = "Unknown Error.";
              break;
          }
        });
    },
  },
};
</script>
