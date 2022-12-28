<template>
  <base-modal :open="props !== null" @close="hideModal">
    <div class="h-100 overflow-auto">
      <div class="row mx-0">
        <div class="col col-sm-6 mb-4">
          <button class="card h-100 w-100" @click="addText">
            <div class="card-body m-auto text-black">
              <h5 class="card-title">Text</h5>
              <p class="card-text">
                <span
                  style="
                    font-family: 'Shadows Into Light Two';
                    font-weight: 400;
                    resize: none;
                  "
                  class="text-center fs-1 w-100"
                >
                  Live<br />Laugh<br />Love
                </span>
              </p>
            </div>
          </button>
        </div>
        <div class="col col-sm-6 mb-4">
          <button class="card h-100 w-100" @click="addToDo">
            <div class="card-body m-auto text-black">
              <h5 class="card-title">To Do List</h5>
              <p class="card-text">
                <to-do-list :modelValue="toDoDemo" :modal="true"></to-do-list>
              </p>
            </div>
          </button>
        </div>
      </div>

      <div class="row mx-0">
        <div class="col col-sm-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Stickers</h5>
              <ul class="nav justify-content-center">
                <li class="nav-item m-2">
                  <button
                    :class="`underline underline-secondary ${
                      stickerType === 'patterns' ? 'active' : ''
                    }`"
                    @click="setStickerType('patterns')"
                  >
                    Patterns
                  </button>
                </li>
                <li class="nav-item m-2">
                  <button
                    :class="`underline underline-secondary ${
                      stickerType === 'icons' ? 'active' : ''
                    }`"
                    @click="setStickerType('icons')"
                  >
                    Icons
                  </button>
                </li>
              </ul>
              <div class="card-text">
                <div class="d-flex flex-wrap" v-if="stickerType === 'patterns'">
                  <div
                    class="m-2"
                    v-for="pattern in patterns"
                    :key="pattern.id"
                    :style="`
                          width: ${290 / (pattern.ratio || 5 / 3)}px !important;
                          height: 290px !important;
                        `"
                  >
                    <svg-sticker
                      :name="pattern.id"
                      :width="290 / (pattern.ratio || 5 / 3)"
                      :height="290"
                      :rotation="0"
                      @click="
                        (colors) =>
                          addSticker(pattern.id, colors, {
                            w:
                              props.dim.h /
                              (
                                pattern.ratio || props.dim.h / props.dim.w
                              ).toString(),
                            h: props.dim.h.toString(),
                            ...(pattern.ratio && {
                              r: pattern.ratio.toString(),
                            }),
                          })
                      "
                    ></svg-sticker>
                  </div>
                </div>
                <div v-else-if="stickerType === 'icons'">
                  <div v-for="category in categories" :key="category">
                    <h3>{{ category.name }}</h3>
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
                        @click="addIcon(icon, [], { w: '87', h: '87', r: '1' })"
                      ></div>
                    </div>
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
import ToDoList from "../components/ToDoList.vue";
import SvgSticker from "./SvgSticker.vue";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

export default {
  components: {
    ToDoList,
    SvgSticker,
  },
  props: ["props"],
  emits: ["close", "addText", "addToDo", "addSticker"],
  data() {
    return {
      patterns: [],
      categories: [],
      stickerType: "patterns",
      toDoDemo: {
        items: [
          { text: "Cook" },
          { text: "Clean", done: true },
          { text: "Shower" },
        ],
        dim: {
          w: 174,
          h: 50,
        },
        font: {
          b: false,
          size: 36,
          fam: "Waiting for the Sunrise",
          col: "#000000",
        },
      },
    };
  },
  methods: {
    addText() {
      this.$emit("addText");
    },
    addToDo() {
      this.$emit("addToDo");
    },
    addSticker(type, colors, dim) {
      // https://stackoverflow.com/questions/44149294/in-vue-js-how-can-i-emit-multiple-value-from-child-to-parent-while-parents-v-o
      this.$emit("addSticker", { type, colors, dim });
    },
    addIcon(icon, colors, dim) {
      // https://stackoverflow.com/questions/44149294/in-vue-js-how-can-i-emit-multiple-value-from-child-to-parent-while-parents-v-o
      this.$emit("addSticker", { icon, colors, dim });
    },
    hideModal() {
      this.$emit("close");
    },
    setStickerType(newVal) {
      this.stickerType = newVal;
    },
  },
  async beforeCreate() {
    var svgDoc = await getDoc(doc(db, "stickers", "svg"));
    Object.entries(svgDoc.data()).forEach(([id, props]) =>
      this.patterns.push({ id, ...props })
    );
    this.patterns.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  },
  async mounted() {
    var emojiDoc = await getDoc(doc(db, "stickers", "icon"));
    const emojiObj = emojiDoc.data();

    const icons = [];
    Object.entries(emojiObj).forEach(([code, categories]) =>
      icons.push({ code, categories })
    );
    icons.sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0));

    const categoryList = [
      {
        label: "Bubbles",
        categories: ["bubble"],
      },
      {
        label: "Holidays & Events",
        categories: ["holiday", "event"],
      },
      {
        label: "Sports & Hobbies",
        categories: ["sport", "hobby"],
      },
      {
        label: "Entertainment",
        categories: ["entertain", "game"],
      },
      {
        label: "Travel",
        categories: ["travel", "beach"],
      },
      {
        label: "Tasks",
        categories: ["chore", "mail"],
      },
      {
        label: "Tools",
        categories: ["tool"],
      },
      {
        label: "Appointments",
        categories: ["doctor"],
      },
      {
        label: "School",
        categories: ["school"],
      },
      {
        label: "Work",
        categories: ["work", "money"],
      },
      {
        label: "Weather",
        categories: ["weather"],
      },
      {
        label: "Music",
        categories: ["music", "instrument"],
      },
      {
        label: "Clothing",
        categories: ["clothing"],
      },
      {
        label: "Plants",
        categories: ["plant", "flower"],
      },
      {
        label: "Food",
        categories: [
          "fruit",
          "vegetable",
          "breakfast",
          "food",
          "dessert",
          "meal",
          "drink",
          "kitchen",
        ],
      },
      {
        label: "Animals",
        categories: ["animal"],
      },
      {
        label: "Hearts",
        categories: ["heart"],
      },
      {
        label: "Transportation",
        categories: ["transport"],
      },
      {
        label: "Buildings",
        categories: ["building"],
      },
      {
        label: "Clocks",
        categories: ["time"],
      },
    ];

    this.categories = categoryList.map((group) => {
      return {
        name: group.label,
        icons: group.categories
          .map((category) =>
            icons
              .filter((icon) => icon.categories.includes(category))
              .map((icon) => icon.code)
          )
          .flat(),
      };
    });
  },
};
</script>
