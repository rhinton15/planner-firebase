<template>
  <div>PROFILE PAGE</div>
  <!-- <label>{{ count }}</label> -->
  <!-- <button class="btn btn-outline-primary" @click="addOne">Add One</button> -->
  <input class="form-control" type="date" v-model="date" @change="load" />
  <input class="form-control" type="text" v-model="value" />
  <button class="btn btn-outline-primary" @click="save">Save</button>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  // onSnapshot,
} from "firebase/firestore";

export default {
  data() {
    return {
      date: null,
      value: "",
      // count: 0,
      unsubscribe: null,
    };
  },
  methods: {
    // async addOne() {
    //   let auth = getAuth();
    //   let db = getFirestore();
    //   await setDoc(
    //     doc(
    //       db,
    //       "users",
    //       auth.currentUser.uid,
    //       "items",
    //       (this.count + 1).toString()
    //     ),
    //     {
    //       count: this.count + 1,
    //     }
    //   );
    // },
    async save() {
      if (this.date) {
        let auth = getAuth();
        let db = getFirestore();
        await setDoc(
          doc(db, "users", auth.currentUser.uid, "items", this.date.toString()),
          {
            value: this.value,
          }
        );
      }
    },
    async load() {
      let auth = getAuth();
      let db = getFirestore();

      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "items",
        this.date.toString()
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.value = docSnap.data().value;
      } else {
        this.value = "";
      }
    },
  },
  // async beforeMount() {
  //   let auth = getAuth();
  //   let db = getFirestore();

  //   // const docRef = doc(db, "items", auth.currentUser.uid);
  //   // const docSnap = await getDoc(docRef);

  //   // if (docSnap.exists()) {
  //   //   this.count = docSnap.data().count;
  //   // }

  //   this.unsubscribe = onSnapshot(
  //     doc(db, "items", auth.currentUser.uid),
  //     (doc) => {
  //       if (doc.exists()) {
  //         this.count = doc.data().count;
  //       }
  //     }
  //   );
  // },
  // beforeUnmount() {
  //   this.unsubscribe();
  // },
};
</script>
