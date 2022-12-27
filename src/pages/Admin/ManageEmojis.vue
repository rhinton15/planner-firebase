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
      <label for="category">Assigning to category:</label>
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
      <label for="category">Also showing category:</label>
      <select
        name="category2"
        id="category2"
        class="form-select"
        v-model="alsoShowCategory"
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
          (mode === 'select' && emojiObj.hasOwnProperty(code)) ||
          (mode === 'categorize' && emojiObj[code].includes(currentCategory))
            ? ''
            : 'outline-'
        }secondary`"
        v-for="code in displayEmojis"
        :key="code"
        v-html="code"
        style="font-family: Noto Color Emoji; font-size: 50px"
        @click="toggleSelection(code)"
      ></button>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";
import { getDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import json from "../../../icons.json";

export default {
  data() {
    return {
      timer: null,
      emojis: json.map(
        (icon) => icon.replaceAll("U+", "&#x").replaceAll(" ", ";") + ";"
      ),
      emojiObj: {},
      mode: "categorize",
      currentCategory: "",
      alsoShowCategory: "",
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
        "holiday",
        "clothing",
        "school",
        "work",
        "money",
        "game",
        "tool",
        "bubble",
        "kitchen",
        "mail",
      ],
    };
  },
  methods: {
    async toggleSelection(code) {
      let emoji = this.emojiObj[code];
      if (this.mode === "select") {
        if (Object.prototype.hasOwnProperty.call(this.emojiObj, code)) {
          emoji = deleteField();
          delete this.emojiObj[code];
        } else {
          emoji = [];
          this.emojiObj[code] = emoji;
        }
        this.$forceUpdate();
      } else {
        const index = emoji.indexOf(this.currentCategory);
        if (index > -1) {
          // only splice array when item is found
          emoji.splice(index, 1); // 2nd parameter means remove one item only
        } else {
          emoji.push(this.currentCategory);
        }
      }

      let newValue = {};
      newValue[code] = emoji;
      await updateDoc(doc(db, "stickers", "icon"), newValue);
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
      if (this.mode === "select") {
        return this.emojis;
      } else {
        return Object.keys(this.emojiObj).filter(
          (code) =>
            this.emojiObj[code].includes(this.currentCategory) ||
            this.emojiObj[code].includes(this.alsoShowCategory) ||
            this.emojiObj[code].length === 0
        );
      }
    },
  },
  async mounted() {
    const docRef = doc(db, "stickers", "icon");
    var emojiDoc = await getDoc(docRef);
    this.emojiObj = emojiDoc.data();
  },
};
</script>
