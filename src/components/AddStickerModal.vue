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
                        :key="pattern"
                >

              <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        :name="pattern"
                        @click="
                          (colors) =>
                            addSticker(pattern, colors, { width: 174, height: 290 })
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
import { ref, listAll } from "firebase/storage";
import { storage } from "../firebase";


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
    const stickers = await listAll(ref(storage, 'stickers'))
    this.patterns = stickers.items.map((itemRef) => itemRef.name.replace('.svg', ''));
  },
};
</script>
