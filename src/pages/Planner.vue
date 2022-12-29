<template>
  <div>
    <div class="m-auto position-relative" ref="page">
      <div
        class="d-flex px-2 flex-column flex-md-row"
        style="height: calc(100vh - 200px)"
      >
        <div class="d-flex flex-column">
          <div class="d-flex">
            <button class="btn" title="help" @click="toggleTutorial">
              <font-awesome-icon icon="fa-solid fa-circle-question" />
            </button>
            <button
              v-if="saveButton.disabled"
              :class="`btn border-0`"
              :title="saveButton.text"
            >
              <font-awesome-icon :icon="`fa-solid fa-${saveButton.icon}`" />
            </button>
            <button
              v-else
              :class="`btn border-0`"
              @click="saveChanges(currentWeek)"
              :title="saveButton.text"
            >
              <font-awesome-icon :icon="`fa-solid fa-${saveButton.icon}`" />
            </button>
            <button
              class="btn"
              title="load template"
              @click="setShowingTemplate('all')"
            >
              <font-awesome-icon icon="fa-solid fa-table-columns" />
            </button>
            <button class="btn" title="add sticker" @click="addStickerModal">
              <font-awesome-icon icon="fa-solid fa-plus" />
            </button>
            <button class="btn" title="clear planner" @click="clearPlanner">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
            <!-- <button class="btn" title="set colors" @click="toggleColors">
              <font-awesome-icon icon="fa-solid fa-palette" />
            </button> -->
            <button class="btn text-dark d-md-none" @click="toggleCalendar">
              <font-awesome-icon icon="fa-solid fa-calendar-days" />
            </button>
          </div>
          <div :class="`d-${showingCalendar ? 'block' : 'none'} d-md-block`">
            <calendar-select v-model="currentWeek"></calendar-select>
          </div>
        </div>
        <div
          :class="`flex-fill d-${
            showingCalendar ? 'none' : 'block'
          } d-md-block`"
        >
          <div
            class="d-flex flex-column pinch-zoom px-5"
            ref="planner"
            id="pinch-zoom"
          >
            <div>
              <div ref="header">
                <div class="clickable" @click="editHeader">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <button class="btn btn-default fs-2" @click.stop="prevWeek">
                      <font-awesome-icon icon="fa-solid fa-chevron-left" />
                    </button>
                    <h1
                      :style="`
                font-family: '${headerSettings.m.fam || 'Montserrat'}';
                font-weight: ${headerSettings.m.b ? 700 : 400};
                font-size: ${headerSettings.m.size || 40}px !important;
                color: ${headerSettings.m.col || '#000000'};`"
                    >
                      {{
                        new Date(
                          parseInt(currentWeek.split("-")[0]),
                          parseInt(currentWeek.split("-")[1]) - 1
                        ).toLocaleString("default", {
                          month: "long",
                        })
                      }}
                      {{ parseInt(currentWeek.split("-")[0]) }}
                    </h1>
                    <button class="btn btn-default fs-2" @click.stop="nextWeek">
                      <font-awesome-icon icon="fa-solid fa-chevron-right" />
                    </button>
                  </div>
                  <div class="d-flex">
                    <label
                      v-for="day in days"
                      :key="day"
                      :style="`
                font-family: '${headerSettings.d.fam || 'Amatic SC'}', cursive;
                font-weight: ${headerSettings.d.b ? 700 : 400};
                font-size: ${headerSettings.d.size || 40}px !important;
                color: ${headerSettings.d.col || '#000000'};
                width: 174px;
              `"
                      class="text-center fs-1"
                      >{{ day }}</label
                    >
                  </div>
                  <div class="d-flex" v-if="level === 'week'">
                    <label
                      v-for="day in 7"
                      :key="day"
                      :style="`
                font-family: '${headerSettings.d.fam || 'Amatic SC'}', cursive;
                font-weight: ${headerSettings.d.b ? 700 : 400};
                font-size: ${headerSettings.d.size || 40}px !important;
                color: ${headerSettings.d.col || '#000000'};
                width: 174px;
              `"
                      class="text-center fs-1"
                      >{{
                        new Date(
                          parseInt(currentWeek.split("-")[0]),
                          parseInt(currentWeek.split("-")[1]) - 1,
                          day + parseInt(currentWeek.split("-")[2]) - 1
                        ).getDate()
                      }}</label
                    >
                  </div>
                </div>
              </div>
            </div>
            <div ref>
              <div class="d-inline-flex" v-if="level === 'week'">
                <!-- https://v2.vuejs.org/v2/guide/list.html#v-for-with-a-Range -->
                <planner-day
                  v-for="day in 7"
                  :key="day"
                  :date="
                    new Date(
                      parseInt(currentWeek.split('-')[0]),
                      parseInt(currentWeek.split('-')[1]) - 1,
                      day + parseInt(currentWeek.split('-')[2]) - 1
                    ).getDate()
                  "
                  :index="day"
                  :disabled="!pageLoaded"
                  @showModal="showModal"
                ></planner-day>
              </div>
              <div v-else-if="level === 'month'">
                <planner-month
                  :year="parseInt(currentWeek.split('-')[0])"
                  :month="parseInt(currentWeek.split('-')[1])"
                  :disabled="!pageLoaded"
                  :width="174"
                  :height="cellHeight"
                  @addText="addText"
                  @addToDo="addToDo"
                  @addSticker="addSticker"
                  @showModal="showModal"
                ></planner-month>
              </div>

              <!-- https://vuejs.org/guide/essentials/list.html#v-for -->
              <sticker
                :ref="'sticker-' + index"
                :id="index"
                v-for="(sticker, index) in stickers"
                :key="sticker"
                v-model="sticker.properties"
                :snapHeight="cellHeight"
                :offset="offset"
                @delete="deleteSticker"
                @update:focus="(focus) => updateFocus(focus, sticker)"
              >
                <div
                  v-if="sticker.properties.icon"
                  v-html="sticker.properties.icon"
                  :style="`
                  font-size: ${sticker.properties.dim.h}px;
                  line-height: ${sticker.properties.dim.h}px;
                  font-family: 'Noto Color Emoji';
                `"
                  class="position-absolute"
                ></div>

                <svg-sticker
                  v-else-if="sticker.properties.type"
                  :scale="sticker.properties.scale"
                  :colors="sticker.properties.colors"
                  :name="sticker.properties.type"
                  :width="sticker.properties.dim.w"
                  :height="sticker.properties.dim.h"
                  :rotation="sticker.properties.prot"
                  :screenShot="screenShot"
                ></svg-sticker>

                <template #text>
                  <textarea
                    v-if="sticker.properties.text !== undefined && !screenShot"
                    :ref="'text-' + index"
                    :style="{
                      color: sticker.properties.font.col || '#000000',
                      fontFamily: sticker.properties.font.fam,
                      fontWeight: 400,
                      fontSize: sticker.properties.font.size + 'px !important',
                      resize: 'none',
                      width:
                        sticker.properties.dim.w -
                        2 *
                          (sticker.properties.bord?.w ||
                            5 + sticker.properties.bord?.in ||
                            5) *
                          (sticker.properties.bord ? 1 : 0) +
                        'px',
                      height: '100%',
                    }"
                    :colors="sticker.properties.colors"
                    :class="`text-${
                      sticker.properties.align
                    } fs-1 border-0 bg-transparent textwhite overflow-hidden ${
                      sticker.properties.font.b ? 'fw-bold' : ''
                    }`"
                    v-model="sticker.properties.text"
                    @input="auto_grow($event.target, sticker)"
                  ></textarea>

                  <div
                    v-else-if="
                      sticker.properties.text !== undefined && screenShot
                    "
                    :style="{
                      color: sticker.properties.font.col || '#000000',
                      fontFamily: sticker.properties.font.fam,
                      fontWeight: 400,
                      fontSize: sticker.properties.font.size + 'px !important',
                      resize: 'none',
                      width:
                        sticker.properties.dim.w -
                        2 *
                          ((sticker.properties.bord?.w || 5) +
                            (sticker.properties.bord?.in || 5)) *
                          (sticker.properties.bord ? 1 : 0) +
                        'px',
                      height: '100%',
                    }"
                    :colors="sticker.properties.colors"
                    :class="`text-${
                      sticker.properties.align
                    } fs-1 border-0 bg-transparent textwhite overflow-hidden ${
                      sticker.properties.font.b ? 'fw-bold' : ''
                    }`"
                  >
                    Some Text
                    <!-- {{ sticker.properties.text }} -->
                  </div>

                  <to-do-list
                    v-else-if="sticker.properties.items"
                    v-model="sticker.properties"
                    :screenShot="screenShot"
                    :ref="'text-' + index"
                  ></to-do-list>
                </template>
              </sticker>
            </div>
          </div>
        </div>
      </div>
    </div>

    <base-modal :open="showingTutorial" @close="toggleTutorial">
      <div class="h-100 overflow-auto">
        <h3>Help Menu</h3>
        <p>
          This website works best on tablets and computers, but can be used on
          mobile devices if desired.
        </p>
        <hr />
        <p>The screenshot below highlights the many available features.</p>
        <img
          src="@/assets/tutorial.jpg"
          class="w-100"
          style="object-fit: contain"
        />
      </div>
    </base-modal>

    <base-modal :open="showingTemplate" @close="setShowingTemplate(null)">
      <div class="d-flex flex-md-row flex-column h-100" style="gap: 10px">
        <div class="card mx-auto" style="min-width: auto">
          <div class="card-body">
            <label class="card-title">Copy from another week</label>
            <calendar-select
              :modelValue="currentWeek"
              @update:modelValue="copyWeek"
            ></calendar-select>
          </div>
        </div>
        <div
          class="card flex-fill d-flex flex-column overflow-auto"
          style="min-width: auto"
        >
          <div class="card-body">
            <label class="card-title">Load or save a template</label>
            <ul class="nav justify-content-center">
              <li class="nav-item m-2">
                <button
                  :class="`underline underline-primary ${
                    showingTemplate === 'all' ? 'active' : ''
                  }`"
                  @click="setShowingTemplate('all')"
                >
                  All
                </button>
              </li>
              <li class="nav-item m-2">
                <button
                  :class="`underline underline-primary ${
                    showingTemplate === 'mine' ? 'active' : ''
                  }`"
                  @click="setShowingTemplate('mine')"
                >
                  Mine
                </button>
              </li>
            </ul>
            <div>
              <button
                class="btn btn-outline-primary m-1"
                @click="saveTemplate(false)"
              >
                Save New Template
              </button>
              <button
                v-if="templates.some((temp) => temp.id === templateId)"
                class="btn btn-outline-primary m-1"
                @click="saveTemplate(true)"
              >
                Update Existing Template
              </button>
            </div>
            <div class="flex-fill overflow-auto">
              <div class="d-flex flex-wrap">
                <button
                  class="btn btn-outline-light m-2 position-relative"
                  v-for="template in templates.filter(
                    (temp) => showingTemplate === 'all' || temp.mine
                  )"
                  :key="template.id"
                  @click="loadTemplate(template)"
                >
                  <button
                    v-if="template.mine"
                    class="btn text-dark position-absolute top-0 end-0"
                    @click.stop="deleteTemplate(template)"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </button>
                  <img :src="template.url" style="width: 200px" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </base-modal>

    <!-- <base-modal :open="showingColors" @close="toggleColors">
      <div v-for="color in allColors" :key="color" :style="{ color: color }">
        {{ color }}
      </div>
    </base-modal> -->

    <add-sticker-modal
      :props="modalProps"
      @close="hideModal"
      @addText="addText"
      @addToDo="addToDo"
      @addSticker="addSticker"
    ></add-sticker-modal>

    <planner-header-settings
      v-if="editingHeader"
      v-model="headerSettings"
      @removeFocus="editingHeader = false"
    ></planner-header-settings>

    <sticker-properties
      v-if="focusedSticker != null"
      :id="stickers.findIndex((sticker) => sticker === focusedSticker)"
      v-model="focusedSticker.properties"
      @moveToFront="moveToFront"
      @moveUp="moveUp"
      @moveDown="moveDown"
      @moveToBack="moveToBack"
      @duplicate="(index) => duplicate('sticker', stickers, index)"
    ></sticker-properties>
  </div>
</template>

<script>
import AddStickerModal from "../components/AddStickerModal.vue";
import CalendarSelect from "../components/CalendarSelect.vue";
import PlannerMonth from "../components/PlannerMonth.vue";
import PlannerDay from "../components/PlannerDay.vue";
import Sticker from "../components/Sticker.vue";
import SvgSticker from "../components/SvgSticker.vue";
import ToDoList from "../components/ToDoList.vue";
import PlannerHeaderSettings from "../components/PlannerHeaderSettings.vue";
import StickerProperties from "../components/StickerProperties.vue";

import html2canvas from "html2canvas";
import PinchZoom from "pinch-zoom-js";

import { auth, db, storage } from "../firebase";
import {
  doc,
  collection,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  listAll,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import $ from "jquery";

export default {
  components: {
    AddStickerModal,
    PlannerMonth,
    PlannerDay,
    Sticker,
    SvgSticker,
    CalendarSelect,
    ToDoList,
    PlannerHeaderSettings,
    StickerProperties,
  },
  data() {
    return {
      plannerId: null,
      testNum: 4,
      pageLoaded: false,
      timer: null,
      texts: [],
      todos: [],
      stickers: [],
      position: {
        top: 0,
        left: 0,
      },
      offset: {
        top: 0,
        left: 0,
      },
      currentWeek: null,
      pendingChanges: false,
      output: "",
      headerSettings: {
        m: {},
        d: {},
      },
      editingHeader: false,
      showingTutorial: false,
      showingTemplate: false,
      showingColors: false,
      saveStatus: "saved",
      modalProps: null,
      focusedSticker: null,
      showingCalendar: false,
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      screenShot: false,
      templates: [],
      setupComplete: false,
    };
  },
  // https://stackoverflow.com/questions/49849376/vue-js-triggering-a-method-function-every-x-seconds
  beforeUnmount() {
    clearInterval(this.timer);
  },
  async beforeMount() {
    const today = new Date();
    let dateAdjustment = (today.getDay() + 6) % 7;
    let startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - dateAdjustment
    );
    this.currentWeek = `${startOfWeek.getFullYear()}-${
      startOfWeek.getMonth() + 1
    }-${startOfWeek.getDate()}`;

    const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

    if (docSnap.exists()) {
      this.plannerId = docSnap.data().lastPlan;
    } else {
      // add new
      let docRef = await addDoc(
        collection(db, "users", auth.currentUser.uid, "planners"),
        {
          name: "Planner 1",
        }
      );
      this.plannerId = docRef.id;
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        new: false,
        lastPlan: docRef.id,
      });
    }

    this.loadTemplates();

    this.showingTutorial = !docSnap.exists();
    this.setupComplete = true;
  },
  async mounted() {
    const el = document.querySelector("div.pinch-zoom");
    new PinchZoom(el, {
      tapZoomFactor: 4,

      onDoubleTap: (pinch, event) => {
        event.preventDefault();
      },
    });

    this.timer = setInterval(() => {
      if (this.pendingChanges) {
        this.saveChanges(this.currentWeek);
      }
    }, 60000); // save once per minute

    $(window).resize(() => {
      this.updateOffset();
    });

    this.updateOffset();
  },
  // https://stackoverflow.com/questions/34283891/vue-js-watch-array-of-objects
  watch: {
    stickers: {
      handler: function () {
        this.pendingChanges = true;
      },
      deep: true,
    },
    texts: {
      handler: function () {
        this.pendingChanges = true;
      },
      deep: true,
    },
    todos: {
      handler: function () {
        this.pendingChanges = true;
      },
      deep: true,
    },
    setupComplete() {
      this.loadPlanner(
        auth.currentUser.uid,
        "planners",
        this.plannerId,
        "plans",
        this.currentWeek
      );
    },
    headerSettings: {
      handler: function () {
        this.pendingChanges = true;
        this.$nextTick(() => {
          $(window).resize();
        });
      },
      deep: true,
    },
    pendingChanges(newValue) {
      this.saveStatus = newValue ? "unsaved" : "saved";
    },
    currentWeek: {
      handler: function (newVal, oldVal) {
        this.editingHeader = false;
        if (this.pendingChanges) {
          this.saveChanges(oldVal);
        }
        this.loadPlanner(
          auth.currentUser.uid,
          "planners",
          this.plannerId,
          "plans",
          newVal
        );
      },
      // https://vuejs.org/guide/essentials/watchers.html#eager-watchers
      immediate: false,
    },
  },
  methods: {
    addStickerModal() {
      this.showModal({
        pos: { x: 0, y: 0 },
        dim: {
          w: 174,
          h: 290,
        },
      });
    },
    showModal(props) {
      if (this.pageLoaded) {
        this.modalProps = props;
      }
    },
    hideModal() {
      this.modalProps = null;
    },
    prevWeek() {
      const currentWeekSplit = this.currentWeek.split("-");
      if (currentWeekSplit.length === 2) {
        this.setMonth(currentWeekSplit[0], currentWeekSplit[1] - 2);
        return;
      }

      var newWeek = new Date(
        parseInt(currentWeekSplit[0]),
        parseInt(currentWeekSplit[1]) - 1,
        parseInt(currentWeekSplit[2]) - 7
      );
      this.currentWeek = `${newWeek.getFullYear()}-${
        newWeek.getMonth() + 1
      }-${newWeek.getDate()}`;
    },
    nextWeek() {
      const currentWeekSplit = this.currentWeek.split("-");
      if (currentWeekSplit.length === 2) {
        this.setMonth(currentWeekSplit[0], currentWeekSplit[1]);
        return;
      }

      var newWeek = new Date(
        parseInt(currentWeekSplit[0]),
        parseInt(currentWeekSplit[1]) - 1,
        parseInt(currentWeekSplit[2]) + 7
      );
      this.currentWeek = `${newWeek.getFullYear()}-${
        newWeek.getMonth() + 1
      }-${newWeek.getDate()}`;
    },
    setMonth(year, month) {
      var newWeek = new Date(year, month, 1);
      this.currentWeek = `${newWeek.getFullYear()}-${newWeek.getMonth() + 1}`;
    },
    addText() {
      let newLength = this.stickers.push({
        properties: {
          text: "",
          pos: this.modalProps.pos,
          dim: {
            w: "174", //"450",
            h: "50",
          },
          font: {
            size: "34", //"120",
            fam: "Shadows Into Light Two",
          },
          align: "center",
        },
      });
      // https://stackoverflow.com/questions/59749325/vue-set-focus-to-dynamic-input-box
      this.$nextTick(() => {
        this.$refs[`text-${newLength - 1}`][0].focus();
        this.$refs[`text-${newLength - 1}`][0].click();
      });
      this.hideModal();
    },
    addToDo() {
      let newLength = this.stickers.push({
        properties: {
          items: [{ text: "" }],
          pos: this.modalProps.pos,
          dim: {
            w: "174", //"720",
            h: "50",
          },
          font: {
            size: "34", //"43",
            fam: "Waiting for the Sunrise", //"Shadows Into Light Two",
            // col: "#ffffff",
            // b: true,
          },
        },
      });
      this.$nextTick(() => {
        this.$refs[`text-${newLength - 1}`][0].click();
      });
      this.hideModal();
    },
    addSticker(sticker) {
      this.stickers.push({
        properties: {
          pos: this.modalProps.pos,
          ...sticker,
        },
      });
      this.hideModal();
    },
    moveToFront(index) {
      let sticker = this.stickers.splice(index, 1);
      this.stickers.push(sticker[0]);
    },
    moveUp(index) {
      let [sticker] = this.stickers.splice(index, 1);
      this.stickers.splice(
        Math.min(index + 1, this.stickers.length),
        0,
        sticker
      );
    },
    moveDown(index) {
      let [sticker] = this.stickers.splice(index, 1);
      this.stickers.splice(Math.max(index - 1, 0), 0, sticker);
    },
    moveToBack(index) {
      let sticker = this.stickers.splice(index, 1);
      this.stickers.unshift(sticker[0]);
    },
    duplicate(refPrefix, ary, index) {
      let item = JSON.parse(JSON.stringify(ary[index])); // deep copy
      item.properties.pos.x += 25;
      item.properties.pos.y += 25;
      const newLength = ary.push(item);

      this.$nextTick(() => {
        this.$refs[`${refPrefix}-${newLength - 1}`][0].click();
      });
    },
    updateFocus(focus, sticker) {
      this.focusedSticker = focus ? sticker : null;
    },
    deleteSticker(index) {
      this.stickers.splice(index, 1);
      this.focusedSticker = null;
    },
    deleteText(index) {
      this.texts.splice(index, 1);
    },
    deleteToDo(index) {
      this.todos.splice(index, 1);
    },
    auto_grow(element, text) {
      this.$nextTick(() => {
        element.style.height = "5px";
        text.properties.dim.h = (
          element.scrollHeight +
          2 *
            ((text.properties.bord?.w || 5) + (text.properties.bord?.in || 5)) *
            (text.properties.bord ? 1 : 0)
        ).toString();
        element.style.height = "100%";
      });
    },
    async saveTemplate(overwrite) {
      // let version = 1;
      if (this.templateId && overwrite) {
        // replace existing
        await setDoc(
          doc(db, "users", auth.currentUser.uid, "templates", this.templateId),
          this.templateDocument
        );
        this.templates.splice(
          this.templates.findIndex((item) => item.id === this.templateId),
          1
        );
      } else {
        // add new
        let docRef = await addDoc(
          collection(db, "users", auth.currentUser.uid, "templates"),
          this.templateDocument
        );
        this.templateId = docRef.id;
        await this.saveChanges(this.currentWeek);
      }

      let el = this.$refs.planner;
      this.screenShot = true;
      this.$nextTick(async () => {
        this.output = (await html2canvas(el)).toDataURL("image/jpeg");

        const storageRef = ref(
          storage,
          `templates/${auth.currentUser.uid}/${this.templateId}.jpeg`
        );

        const metadata = {
          cacheControl: "max-age=604800",
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        const canvas = await html2canvas(el);

        canvas.toBlob(async (bigBlob) => {
          await canvas.toBlob(
            async (blob) => {
              await uploadBytes(storageRef, blob, metadata);
              const url = await getDownloadURL(storageRef);
              this.templates.unshift({
                id: this.templateId,
                uid: auth.currentUser.uid,
                mine: true,
                url,
              });
            },
            "image/jpeg",
            30000 / bigBlob.size
          );
        }, "image/jpeg");

        this.screenShot = false;
        this.setShowingTemplate(null);
      });
    },
    async deleteTemplate(template) {
      if (confirm("Are you sure you want to delete this template?")) {
        await deleteObject(
          ref(storage, `templates/${template.uid}/${template.id}.jpeg`)
        );

        this.templates.splice(
          this.templates.findIndex((temp) => temp.id === template.id),
          1
        );
      }
    },
    async loadTemplates() {
      const storage = getStorage();

      // Create a reference under which you want to list
      const listRef = ref(storage, "templates");

      let { prefixes } = await listAll(listRef);
      prefixes.forEach(async (prefix) => {
        let { items } = await listAll(prefix);
        let mine = prefix.name === auth.currentUser.uid;
        items.forEach(async (item) => {
          this.templates.push({
            id: item.name.replace(/\..*$/, ""),
            uid: prefix.name,
            url: await getDownloadURL(item),
            mine,
          });
        });
      });
    },
    async loadTemplate(template) {
      let existingStickers = this.stickers;
      await this.loadPlanner(template.uid, "templates", template.id);
      this.stickers = this.stickers.concat(existingStickers);
      await this.saveChanges(this.currentWeek);
      this.setShowingTemplate(null);
    },
    async copyWeek(fromWeek) {
      if (fromWeek !== this.currentWeek) {
        let existingStickers = this.stickers;
        await this.loadPlanner(
          auth.currentUser.uid,
          "planners",
          this.plannerId,
          "plans",
          fromWeek
        );
        this.stickers = this.stickers.concat(existingStickers);
        await this.saveChanges(this.currentWeek);
        this.setShowingTemplate(null);
      }
    },
    async loadPlanner(...args) {
      this.showingCalendar = false;
      this.focusedSticker = null;
      this.pageLoaded = false;
      this.texts = null;
      this.todos = null;
      this.stickers = null;

      if (this.setupComplete && args[args.length - 1]) {
        const docRef = doc(db, "users", ...args);
        const docSnap = await getDoc(docRef);

        var res = docSnap.data();

        this.pageLoaded = true;

        this.templateId = res?.temp || null;
        this.stickers = res?.stickers || [];
        this.headerSettings = res?.header || {
          m: {},
          d: {},
        };

        this.stickers = this.stickers.map((sticker) => {
          return { properties: sticker };
        });

        this.$nextTick(() => {
          this.pendingChanges = false;
        });
      }
    },
    async clearPlanner() {
      if (
        confirm(
          "Are you sure you want to clear all text and stickers from the current calendar? This cannot be undone."
        )
      ) {
        await deleteDoc(
          doc(
            db,
            "users",
            auth.currentUser.uid,
            "planners",
            this.plannerId,
            "plans",
            this.currentWeek
          )
        );
        await this.loadPlanner(
          auth.currentUser.uid,
          "planners",
          this.plannerId,
          "plans",
          this.currentWeek
        );
      }
    },
    async saveChanges(week) {
      if (this.pageLoaded) {
        this.saveStatus = "saving";

        let newDoc = this.plannerDocument;
        if (this.templateId) {
          newDoc.temp = this.templateId;
        }

        try {
          await setDoc(
            doc(
              db,
              "users",
              auth.currentUser.uid,
              "planners",
              this.plannerId,
              "plans",
              week
            ),
            newDoc
          );
          this.pendingChanges = false;
          this.saveStatus = "saved";
        } catch (ex) {
          this.saveStatus = "error";
        }
      }
    },
    editHeader() {
      this.editingHeader = true;
    },
    toggleTutorial() {
      this.showingTutorial = !this.showingTutorial;
    },
    setShowingTemplate(val) {
      this.showingTemplate = val;
    },
    // toggleColors() {
    //   this.showingColors = !this.showingColors;
    // },
    toggleCalendar() {
      this.showingCalendar = !this.showingCalendar;
    },
    updateOffset() {
      var cell1 = document.getElementById("1-1");
      // https://stackoverflow.com/questions/46451319/access-el-inside-a-computed-property
      // https://stackoverflow.com/questions/11634770/get-position-offset-of-element-relative-to-a-parent-container
      this.offset = {
        top: cell1.offsetTop,
        left: cell1.offsetLeft,
      };
    },
  },
  computed: {
    plannerDocument() {
      return {
        header: this.headerSettings,
        stickers: this.stickers
          .map((item) => item.properties)
          .filter(
            (item) =>
              item.text ||
              item.items?.some((todoItem) => todoItem.text) ||
              item.type ||
              item.icon
          ),
      };
    },
    templateDocument() {
      const stickers = [];
      this.plannerDocument.stickers.forEach((sticker) => {
        if (sticker.text) {
          // text
          stickers.push({ ...sticker, text: "Some Text" });
        } else if (sticker.items) {
          // to do
          const toDos = [];
          sticker.items.forEach(() => {
            toDos.push({ text: "To Do" });
          });
          stickers.push({ ...sticker, items: toDos });
        } else {
          // pattern
          stickers.push(sticker);
        }
      });
      return { ...this.plannerDocument, stickers };
    },
    // allColors() {
    //   return this.stickers
    //     .map((sticker) => {
    //       const colors = sticker.properties.colors || [];
    //       const fontColor = sticker.properties.font?.color || [];
    //       // TODO: include border color
    //       return colors.concat(fontColor);
    //     })
    //     .flat()
    //     .filter((value, index, self) => self.indexOf(value) === index);
    // },
    saveButton() {
      let buttonConfig = {};
      switch (this.saveStatus) {
        case "unsaved":
          buttonConfig = {
            class: "warning",
            disabled: false,
            icon: "floppy-disk",
            text: "Unsaved changes",
          };
          break;
        case "saving":
          buttonConfig = {
            class: "secondary",
            disabled: true,
            icon: "spinner fa-spin",
            text: "Saving",
          };
          break;
        case "saved":
          buttonConfig = {
            class: "primary",
            disabled: true,
            icon: "check",
            text: "Saved",
          };
          break;
        case "error":
          buttonConfig = {
            class: "danger",
            disabled: true,
            icon: "exclamation",
            text: "Error saving",
          };
          break;
      }
      return buttonConfig;
    },
    today() {
      // https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
      var date = new Date();
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset);
    },
    level() {
      var level;
      switch (this.currentWeek.split("-").length) {
        case 1:
          level = "year";
          break;
        case 2:
          level = "month";
          break;
        case 3:
          level = "week";
          break;
      }
      return level;
    },
    cellHeight() {
      return this.level === "week" ? 290 : 174;
    },
  },
};
</script>

<style scoped>
.clickable:hover {
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
