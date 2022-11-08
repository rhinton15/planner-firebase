<template>
  <div class="container text-start">
    <h1 class="text-center">Contact Us</h1>

    <div class="form-group mb-2">
      <label for="subject" class="fs-5">Subject</label>
      <input id="subject" class="form-control" v-model="subject" />
    </div>
    <div class="form-group mb-2">
      <label for="message" class="fs-5">Message</label>
      <textarea
        id="message"
        rows="10"
        class="form-control"
        v-model="message"
      ></textarea>
    </div>

    <div class="text-center mb-2">
      <button class="btn btn-outline-primary" @click="submit">Submit</button>
    </div>

    <div v-if="saveSuccessful == true" class="alert alert-primary" role="alert">
      Thanks for the feedback!
    </div>
    <div
      v-else-if="saveSuccessful == false"
      class="alert alert-danger"
      role="alert"
    >
      Error submitting feedback.
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      subject: "",
      message: "",
      saveSuccessful: null,
    };
  },
  methods: {
    async submit() {
      try {
        await addDoc(collection(db, "messages"), {
          email: auth.currentUser.email,
          subject: this.subject,
          message: this.message,
          read: false,
        });

        this.saveSuccessful = true;
        this.subject = "";
        this.message = "";
      } catch {
        this.saveSuccessful = false;
      }
    },
  },
};
</script>
