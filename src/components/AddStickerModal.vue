<template>
  <base-modal :open="open" @close="hideModal">
    <!-- ADD STICKER -->
    <div class="row">
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

    <div class="row mt-4">
      <div class="col col-sm-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Stickers</h5>
            <div class="card-text">
              <div
                id="carouselExampleDark"
                class="carousel carousel-dark slide"
                data-bs-ride="carousel"
              >
                <!-- data-bs-interval="false" -->
                <div class="carousel-inner">
                  <div
                    v-for="index in Math.ceil(patterns.length / 2)"
                    :key="index"
                    :class="'carousel-item' + (index === 1 ? ' active' : '')"
                  >
                    <div class="w-auto d-flex justify-content-around">
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        :name="patterns[2 * (index - 1)]"
                        @click="
                          (colors) =>
                            addSticker(patterns[2 * (index - 1)], colors)
                        "
                      ></svg-sticker>
                      <svg-sticker
                        v-if="2 * (index - 1) + 1 < patterns.length"
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        :name="patterns[2 * (index - 1) + 1]"
                        @click="
                          (colors) =>
                            addSticker(patterns[2 * (index - 1) + 1], colors)
                        "
                      ></svg-sticker>
                    </div>
                  </div>

                  <!-- <div class="carousel-item active" @click="addSticker('dots')">
                    <dots></dots>
                  </div>
                  <div class="carousel-item" @click="addSticker('stripes')">
                    <stripes></stripes>
                  </div> -->

                  <!-- <div class="carousel-item active">
                    <div class="w-auto d-flex justify-content-around">
                      <dots @click="addSticker('dots')"></dots>
                      <stripes
                        :colors="['#c992fc', '#9a2eff']"
                        @click="addSticker('stripes', ['#c992fc', '#9a2eff'])"
                      ></stripes>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <dots2 @click="addSticker('dots2')"></dots2>
                      <dots3 @click="addSticker('dots3')"></dots3>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="solid"
                        @click="(colors) => addSticker('solid', colors)"
                      ></svg-sticker>
                      <buffalo-check
                        :colors="['#ff0000', '#000000']"
                        @click="
                          addSticker('buffalo-check', ['#ff0000', '#000000'])
                        "
                      ></buffalo-check>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <squiggle
                        :colors="['#c992fc']"
                        @click="addSticker('squiggle', ['#c992fc'])"
                      ></squiggle>
                      <ombre
                        :colors="['#00fffe', '#08289d']"
                        @click="addSticker('ombre', ['#00fffe', '#08289d'])"
                      ></ombre>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <thin-stripes
                        :colors="['#808080', '#CCCCCC']"
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        @click="
                          addSticker('thin-stripes', ['#808080', '#CCCCCC'])
                        "
                      ></thin-stripes>
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="chevron"
                        @click="(colors) => addSticker('chevron', colors)"
                      ></svg-sticker>
                      <div
                        style="
                          width: 174px;
                          height: 290px;
                          background-image: url('data:image/svg+xml,%3Csvg width=\'58px\' height=\'58px\' viewBox=\'0 0 174 174\' version=\'1.1\' id=\'svg5\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:svg=\'http://www.w3.org/2000/svg\'%3E%3Cdefs id=\'defs2\' /%3E%3Cg id=\'layer1\'%3E%3Cpath style=\'fill:%23ffd5d5;fill-opacity:1;stroke:none;stroke-width:1.00157;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\' d=\'M 0,2.2677165e-5 H 174 V 174 Z\' id=\'path2688\' /%3E%3Cpath style=\'fill:%23ffaaaa;fill-opacity:1;stroke:none;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\' d=\'M 2.6456692e-6,0 174,174 H 2.6456692e-6 Z\' id=\'path2567\' /%3E%3Cpath style=\'fill:%23ffaaaa;fill-opacity:1;stroke:none;stroke-width:0.500787;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\' d=\'M 86.999994,2.2677165e-5 H 174 V 87.000021 Z\' id=\'path2123\' /%3E%3Cpath style=\'fill:%23ffd5d5;fill-opacity:1;stroke:none;stroke-width:0.999999px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\' d=\'M 2.6456692e-6,87.000006 86.999994,174 H 2.6456692e-6 Z\' id=\'path2545\' /%3E%3C/g%3E%3C/svg%3E');
                        "
                        @click="
                          addSticker('thin-stripes', ['#808080', '#CCCCCC'])
                        "
                      ></div>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <div
                        style="
                          width: 174px;
                          height: 290px;
                          background-image: url(http://localhost:3000/stickers/thin-stripes.svg);
                        "
                        @click="
                          addSticker('thin-stripes', ['#808080', '#CCCCCC'])
                        "
                      ></div>
                      <div
                        style="
                          width: 174px;
                          height: 290px;
                          background-image: url('data:image/svg+xml,%3Csvg width=\'58px\' height=\'58px\' viewBox=\'0 0 87.000008 87\' version=\'1.1\' id=\'svg5\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:svg=\'http://www.w3.org/2000/svg\'%3E%3Cdefs id=\'defs2\' /%3E%3Cg id=\'layer1\'%3E%3Cpath style=\'fill:%23ffaaaa;fill-opacity:1;stroke:none;stroke-width:0.500787;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\' d=\'M 0,0 H 87.000006 V 86.999998 Z\' id=\'path2123\' /%3E%3Cpath style=\'fill:%23ffd5d5;fill-opacity:1;stroke:none;stroke-width:0.999999px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\' d=\'M 0,0 86.999991,86.999994 H 0 Z\' id=\'path2545\' /%3E%3C/g%3E%3C/svg%3E');
                        "
                        @click="
                          addSticker('thin-stripes', ['#808080', '#CCCCCC'])
                        "
                      ></div>
                      <div
                        v-html="
                          '<svg width=\'58px\' height=\'58px\' viewBox=\'0 0 87.000008 87\' version=\'1.1\' id=\'svg5\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:svg=\'http://www.w3.org/2000/svg\'> <defs id=\'defs2\' /><g id=\'layer1\'> <path style=\'fill:#ffaaaa;fill-opacity:1;stroke:none;stroke-width:0.500787;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\' d=\'M 0,0 H 87.000006 V 86.999998 Z\' id=\'path2123\' /> <path style=\'fill:#ffd5d5;fill-opacity:1;stroke:none;stroke-width:0.999999px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\' d=\'M 0,0 86.999991,86.999994 H 0 Z\' id=\'path2545\' /> </g></svg>'
                        "
                        style="width: 174px; height: 290px"
                      ></div>
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="diagonal-stripes"
                        @click="
                          (colors) => addSticker('diagonal-stripes', colors)
                        "
                      ></svg-sticker>
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="triangles"
                        @click="(colors) => addSticker('triangles', colors)"
                      ></svg-sticker>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <div class="w-auto d-flex justify-content-around">
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="buffalo-check-3"
                        @click="
                          (colors) => addSticker('buffalo-check-3', colors)
                        "
                      ></svg-sticker>
                      <svg-sticker
                        style="
                          width: 174px !important;
                          height: 290px !important;
                        "
                        name="checker"
                        @click="(colors) => addSticker('checker', colors)"
                      ></svg-sticker>
                    </div>
                  </div> -->
                </div>
                <button
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<script>
// import Dots from "./Dots.vue";
// import Dots2 from "./Dots2.vue";
// import Dots3 from "./Dots3.vue";
// import Stripes from "./Stripes.vue";
// import BuffaloCheck from "./BuffaloCheck.vue";
// import Squiggle from "./Squiggle.vue";
// import Ombre from "./Ombre.vue";
// import ThinStripes from "./ThinStripes.vue";
import SvgSticker from "./SvgSticker.vue";
import { ref, listAll } from "firebase/storage";
import { storage } from "../firebase";


export default {
  components: {
    // Dots,
    // Dots2,
    // Dots3,
    // Stripes,
    // BuffaloCheck,
    // Squiggle,
    // Ombre,
    // ThinStripes,
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
    addSticker(type, colors) {
      // https://stackoverflow.com/questions/44149294/in-vue-js-how-can-i-emit-multiple-value-from-child-to-parent-while-parents-v-o
      this.$emit("addSticker", { type, colors });
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
