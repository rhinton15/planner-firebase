<template>
  <div class="m-1 w-100">
    <div v-if="mode === 'select'">
      <h1>Select emojis to include</h1>
      <button class="btn btn-outline-primary" @click="mode = 'categorize'">
        Categorize
      </button>
    </div>
    <div v-else>
      <h1>Categorize emojis</h1>
      <button class="btn btn-outline-primary" @click="mode = 'select'">
        Select
      </button>
      <select
        name="category"
        id="category"
        class="form-select"
        v-model="currentCategory"
      >
        <option value=""></option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
    <div
      class="d-flex flex-wrap"
      v-if="mode === 'select' || currentCategory !== ''"
    >
      <button
        :class="`m-1 btn btn-${
          (mode === 'select' && emoji.selected) ||
          (mode === 'categorize' && emoji.categories.includes(currentCategory))
            ? ''
            : 'outline-'
        }secondary`"
        v-for="emoji in displayEmojis"
        :key="emoji.code"
        v-html="emoji.code"
        style="font-family: Noto Color Emoji; font-size: 50px"
        @click="toggleSelection(emoji)"
      ></button>
    </div>
  </div>
  <!-- <h1>EMOJIS!!</h1>
  <table class="table">
    <thead>
      <tr>
        <th>Icon</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="emoji in emojis" :key="emoji.code">
        <td
          style="font-family: Noto Color Emoji; font-size: 25px"
          v-html="emoji.code"
        ></td>
        <td>{{ emoji.desc }}</td>
      </tr>
    </tbody>
  </table> -->
</template>

<script>
import { db } from "../../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import json from "../../../emojis.json";

export default {
  data() {
    return {
      timer: null,
      emojis: [],
      mode: "categorize",
      currentCategory: "",
      categories: [
        "breakfast",
        "food",
        "dessert",
        "fruit",
        "vegetable",
        "meal",
        "drink",
        "animal",
        "flower",
        "clothing",
        "time",
        "weather",
        "chore",
        "transport",
        "sport",
        "hobby",
        "beach",
        "travel",
        "music",
        "heart",
        "entertain",
        "instrument",
        "doctor",
        "plant",
        "building",
        "event",
        "clothing",
        "school",
        "work",
        "money",
      ],
      //   emojis: json
      //     .filter((icon) => icon.code.startsWith("U+"))
      //     .map((icon) => {
      //       return {
      //         desc: icon.desc,
      //         code: icon.code.replaceAll("U+", "&#x").replaceAll(" ", ";") + ";",
      //       };
      //     }),
    };
  },
  methods: {
    async toggleSelection(emoji) {
      if (this.mode === "select") {
        emoji.selected = !emoji.selected;
      } else {
        const index = emoji.categories.indexOf(this.currentCategory);
        if (index > -1) {
          // only splice array when item is found
          emoji.categories.splice(index, 1); // 2nd parameter means remove one item only
        } else {
          emoji.categories.push(this.currentCategory);
        }
      }

      //   console.log(emoji);
      let { code, ...rest } = emoji;
      await setDoc(doc(db, "icons", code), rest);
      //   await setDoc(doc(db, "icons", emoji.code), emoji);
    },
    addCategory(category) {
      var newCategory = category.toLower();
      if (!this.categories.includes(newCategory)) {
        this.categories().push();
      }
    },
  },
  computed: {
    displayEmojis() {
      if (this.mode === "selected") {
        return this.emojis;
      } else {
        return this.emojis.filter(
          (emoji) =>
            emoji.selected &&
            (emoji.categories.includes(this.currentCategory) ||
              emoji.categories.length === 0)
        );
      }
    },
  },
  async mounted() {
    // this.emojis = json
    //   .filter((icon) => icon.code.startsWith("U+"))
    //   .map((icon) => {
    //     return {
    //       desc: icon.desc,
    //       code: icon.code.replaceAll("U+", "&#x").replaceAll(" ", ";") + ";",
    //     };
    //   });

    const querySnapshot = await getDocs(collection(db, "icons"));
    querySnapshot.forEach((doc) => {
      this.emojis.push({ ...doc.data(), code: doc.id });

      //   let emoji = this.emojis.at(-1);
      //   if (emoji.categories === undefined) {
      //     console.log(emoji.code);
      //     emoji.categories = [];
      //     let { code, ...rest } = emoji;
      //     console.log(code);
      //     console.log(rest);
      //     await setDoc(doc(db, "icons", code), rest);
      //   }
    });

    // console.log(this.emojis.find((emoji) => emoji.code === "&#x00A9;"));
    //   .map((icon) => {
    //     return { selected: icon.code === "&#x1F604;", ...icon };
    //   });

    // this.emojis.forEach(async (emoji) => {
    //   await setDoc(doc(db, "icons", emoji.code), {
    //     desc: emoji.desc,
    //     selected: false,
    //     categories: [],
    //   });
    //   //   await db.collection("icons").add(emoji);
    // });
    // console.log(this.emojis);
  },
};
</script>
