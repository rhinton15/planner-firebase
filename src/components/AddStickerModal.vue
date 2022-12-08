<template>
  <base-modal :open="open" @close="hideModal">
    <div class="h-100 overflow-auto">
    <!-- ADD STICKER -->
    <div class="row mx-0">
      <div class="col col-sm-6">
        <button class="card h-100 w-100" @click="addText">
          <div class="card-body m-auto">
            <h5 class="card-title">Text</h5>
            <p class="card-text">
              <span
                style="font-family: 'Shadows Into Light Two'; font-weight: 400; resize: none"
                class="text-center fs-1 w-100"
              >
                Live<br/>Laugh<br/>Love
              </span>
            </p>
          </div>
        </button>
      </div>
      <div class="col col-sm-6">
        <button class="card h-100 w-100" @click="addToDo">
          <div class="card-body m-auto">
            <h5 class="card-title">To Do List</h5>
            <p class="card-text">
              <ul class="fs-1 w-100" style="font-family: 'Waiting for the Sunrise';">
                <li>Cook</li>
                <li>Clean</li>
                <li>Shower</li>
              </ul>
            </p>
          </div>
        </button>
      </div>
    </div>

    <div class="row mt-4 mx-0">
      <div class="col col-sm-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Stickers</h5>
            <div class="card-text">
              <div class="d-flex flex-wrap">
                <div class="m-2"
                        v-for="pattern in patterns"
                        :key="pattern.id"
                >

              <svg-sticker
                        :style="`
                          width: ${290/(pattern.ratio || 5/3)}px !important;
                          height: 290px !important;
                        `"
                        :name="pattern.id"
                        @click="
                          (colors) =>
                            addSticker(pattern.id, colors, { width: 290/(pattern.ratio || 5/3), height: 290, ...(pattern.ratio && {ratio: pattern.ratio}) })
                        "
                      ></svg-sticker>
                </div>
              </div>
              <div v-for="category in categories" :key="category">
                <h1>{{ category.name }}</h1>
              <div class="d-flex flex-wrap">
                <div
                v-for="icon in category.icons"
                :key="icon"
                  v-html="icon"
                  class="m-2"
                  :style="`
                    font-size: 50px;
                    line-height: 50px;
                    font-family: 'Noto Color Emoji';
                  `"
                          @click="
                            addIcon(icon, [], { width: 100, height: 100, ratio: 1 })
                          "
                ></div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </base-modal>
</template>

<script>
import SvgSticker from "./SvgSticker.vue";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  components: {
    SvgSticker,
  },
  props: ["open"],
  emits: ["close", "addText", "addToDo", "addSticker"],
  data() {
    return {
      patterns: [],
      categories: [] // ["26BD", "1F37F", "1F95E", "1F6D2"]
    };
  },
  // computed: {
  //   unicodeIcons(){
  //     return this.icons.map(icon => `&#x${icon};`)
  //   }
  // },
  methods: {
    addText() {
      this.$emit("addText");
    },
    addToDo() {
      this.$emit("addToDo");
    },
    addSticker(type, colors, dimensions) {
      // https://stackoverflow.com/questions/44149294/in-vue-js-how-can-i-emit-multiple-value-from-child-to-parent-while-parents-v-o
      this.$emit("addSticker", { type, colors, dimensions });
    },
    addIcon(icon, colors, dimensions) {
      // https://stackoverflow.com/questions/44149294/in-vue-js-how-can-i-emit-multiple-value-from-child-to-parent-while-parents-v-o
      this.$emit("addSticker", { icon, colors, dimensions });
    },
    hideModal() {
      this.$emit("close");
    },
  },
  async beforeCreate() {
    const querySnapshot = await getDocs(collection(db, "stickers"));
querySnapshot.forEach((doc) => {
  this.patterns.push({ id: doc.id, ...doc.data()});
});
  },
  async mounted(){
    const q = query(collection(db, "icons"), where("selected", "==", true));

const icons = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      icons.push({ code: doc.id, categories: doc.data().categories });
    });

    this.categories = icons.map(icon => icon.categories).flat()
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(category => { return { name: category, icons: icons.filter(icon => icon.categories.includes(category)).map(icon => icon.code) } });
  }
};
</script>
