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
      <!-- <div v-for="(emoji, code) in emojiObj" :key="code">
        <div v-if="!emoji.categories">
          {{ code }}
        </div>
      </div> -->
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
      <!-- <button
        :class="`m-1 btn btn-${
          (mode === 'select' && emoji.hasOwnProperty(code)) ||
          (mode === 'categorize' && emoji.categories?.includes(currentCategory))
            ? ''
            : 'outline-'
        }secondary`"
        v-for="[code, emoji] in Object.entries(emojiObj).filter(
          (emoji) =>
            mode === 'select' ||
            (emoji[1].selected &&
              (emoji[1].categories?.includes(this.currentCategory) ||
                emoji[1].categories?.length === 0))
        )"
        :key="code"
        v-html="code"
        style="font-family: Noto Color Emoji; font-size: 50px"
        @click="toggleSelection(code)"
      ></button> -->
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
import {
  // collection,
  getDoc,
  // getDocs,
  doc,
  // setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import json from "../../../emojis.json";
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
    async toggleSelection(code) {
      let emoji = this.emojiObj[code];
      if (this.mode === "select") {
        if (Object.prototype.hasOwnProperty.call(this.emojiObj, code)) {
          console.log("delete");
          emoji = deleteField();
          delete this.emojiObj[code];
        } else {
          console.log("add " + code);
          emoji = [];
          this.emojiObj[code] = emoji;
          console.log(this.emojiObj);
        }
        this.$forceUpdate();
      } else {
        const index = emoji.indexOf(this.currentCategory);
        if (index > -1) {
          // only splice array when item is found
          emoji.splice(index, 1); // 2nd parameter means remove one item only
          // emoji.categories.splice(index, 1); // 2nd parameter means remove one item only
          // if(emoji.categories.length === 0){
          //   delete emoji.categories; // remove property if empty
          // }
        } else {
          // if(emoji.categories === undefined){
          //   emoji.categories = [this.currentCategory];
          // } else {
          // emoji.categories.push(this.currentCategory);
          // }
          emoji.push(this.currentCategory);
        }
      }

      //   console.log(emoji);
      // let { code, ...rest } = emoji;
      // await setDoc(doc(db, "icons", code), rest);
      let newValue = {};
      newValue[code] = emoji;
      await updateDoc(doc(db, "iconsnew", "doc"), newValue);
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
      // console.log("displayemojis");
      if (this.mode === "select") {
        // console.log(this.emojis);
        return this.emojis;
      } else {
        return Object.keys(this.emojiObj).filter(
          (code) =>
            this.emojiObj[code].includes(this.currentCategory) ||
            this.emojiObj[code].length === 0
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

    // const emojiList = [];
    // const querySnapshot = await getDocs(collection(db, "icons"));
    // querySnapshot.forEach((doc) => {
    //   emojiList.push({ ...doc.data(), code: doc.id });

    //   //   let emoji = this.emojis.at(-1);
    //   //   if (emoji.categories === undefined) {
    //   //     console.log(emoji.code);
    //   //     emoji.categories = [];
    //   //     let { code, ...rest } = emoji;
    //   //     console.log(code);
    //   //     console.log(rest);
    //   //     await setDoc(doc(db, "icons", code), rest);
    //   //   }
    // });

    // // console.log(this.emojis.length);

    // let emojisNew = {};
    // emojiList.forEach((emoji) => {
    //   if (emoji.selected) {
    //     emojisNew[emoji.code] = emoji.categories;
    //   }
    // });

    // console.log(emojisNew);
    const docRef = doc(db, "iconsnew", "doc");
    // await setDoc(docRef, emojisNew);

    // await updateDoc(docRef, {
    //   "&#x00A9;": { desc: "copyright", selected: true },
    // });

    var emojiDoc = await getDoc(docRef);
    this.emojiObj = emojiDoc.data();
    // console.log(docu.data());

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
