<template>
  <table class="table">
    <thead>
      <tr>
        <th>Read</th>
        <th>Subject</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="doc in docs" :key="doc.id">
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            v-model="doc.read"
            @click="updateReadStatus(doc)"
          />
        </td>
        <td>{{ doc.subject }}</td>
        <td>{{ doc.message }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { db } from "../../firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      docs: [],
    };
  },
  methods: {
    async getMessages() {
      const q = query(collection(db, "messages"), where("read", "==", false));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        this.docs.push({ ...document.data(), id: document.id });
      });
    },
    async updateReadStatus(document) {
      await updateDoc(doc(db, "messages", document.id), {
        read: !document.read,
      });
    },
  },
  async mounted() {
    await this.getMessages();
  },
};
</script>
