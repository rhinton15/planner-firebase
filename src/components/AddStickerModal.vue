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
                style="font-family: 'Amatic SC'; font-weight: 700; resize: none"
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
              <ul class="fs-1 w-100" style="font-family: 'Ms Madi';">
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
                            addSticker(pattern.id, colors, { width: 290/(pattern.ratio || 5/3), height: 290, ratio: pattern.ratio })
                        "
                      ></svg-sticker>
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
import { collection, getDocs } from "firebase/firestore";

export default {
  components: {
    SvgSticker,
  },
  props: ["open"],
  emits: ["close", "addText", "addToDo", "addSticker"],
  data() {
    return {
      patterns: [],
    };
  },
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
};
</script>
