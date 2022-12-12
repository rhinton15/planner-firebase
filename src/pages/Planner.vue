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
              :class="`btn border-0`"
              :disabled="saveButton.disabled"
              @click="saveChanges(currentWeek)"
              :title="saveButton.text"
            >
              <font-awesome-icon :icon="`fa-solid fa-${saveButton.icon}`" />
            </button>
            <button class="btn" title="load template" @click="toggleTemplate">
              <font-awesome-icon icon="fa-solid fa-table-columns" />
            </button>
            <button class="btn" title="clear planner" @click="clearPlanner">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
            <button class="btn" title="set colors" @click="toggleColors">
              <font-awesome-icon icon="fa-solid fa-palette" />
            </button>
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
                font-family: '${headerSettings.month.family}';
                font-weight: ${headerSettings.month.bold ? 700 : 400};
                font-size: ${headerSettings.month.size}px !important;
                color: ${headerSettings.month.color};`"
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
                font-family: '${headerSettings.day.family}', cursive;
                font-weight: ${headerSettings.day.bold ? 700 : 400};
                font-size: ${headerSettings.day.size * 0.7}px !important;
                color: ${headerSettings.day.color};
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
                font-family: '${headerSettings.day.family}', cursive;
                font-weight: ${headerSettings.day.bold ? 700 : 400};
                font-size: ${headerSettings.day.size}px !important;
                color: ${headerSettings.day.color};
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
                <planner-header-settings
                  v-if="editingHeader"
                  v-model="headerSettings"
                ></planner-header-settings>
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
                ></svg-sticker>

                <template #text>
                  <textarea
                    v-if="sticker.properties.text !== undefined"
                    :ref="'text-' + index"
                    :style="{
                      color: sticker.properties.font.color,
                      fontFamily: sticker.properties.font.family,
                      fontWeight: 400,
                      fontSize: sticker.properties.font.size + 'px !important',
                      resize: 'none',
                      width:
                        sticker.properties.dim.w -
                        2 *
                          (sticker.properties.border.width +
                            sticker.properties.border.inset) *
                          sticker.properties.border.on +
                        'px',
                      height: '100%',
                    }"
                    :colors="sticker.properties.colors"
                    :class="`text-${
                      sticker.properties.align
                    } fs-1 border-0 bg-transparent textwhite overflow-hidden ${
                      sticker.properties.font.bold ? 'fw-bold' : ''
                    }`"
                    v-model="sticker.properties.text"
                    @input="auto_grow($event.target, sticker)"
                  ></textarea>

                  <to-do-list
                    v-else-if="sticker.properties.items"
                    v-model="sticker.properties"
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
      <img
        src="@/assets/tutorial.jpg"
        class="w-100 h-100"
        style="object-fit: contain"
      />
    </base-modal>

    <base-modal :open="showingTemplate" @close="toggleTemplate">
      <calendar-select
        :modelValue="currentWeek"
        @update:modelValue="loadTemplate"
      ></calendar-select>
    </base-modal>

    <base-modal :open="showingColors" @close="toggleColors">
      <div v-for="color in allColors" :key="color" :style="{ color: color }">
        {{ color }}
      </div>
    </base-modal>

    <add-sticker-modal
      :props="modalProps"
      @close="hideModal"
      @addText="addText"
      @addToDo="addToDo"
      @addSticker="addSticker"
    ></add-sticker-modal>

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

import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

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
      pageLoaded: false,
      timer: null,
      texts: [],
      todos: [],
      stickers: [],
      position: {
        top: 0,
        left: 0,
      },
      currentWeek: null,
      pendingChanges: false,
      output: "",
      headerSettings: {
        month: {
          color: "#000000",
          family: "Montserrat",
          size: 40,
          bold: false,
        },
        day: {
          color: "#000000",
          family: "Amatic SC",
          size: 40,
          bold: true,
        },
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
    this.showingTutorial = !docSnap.exists();
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      new: false,
    });
  },
  async mounted() {
    const el = document.querySelector("div.pinch-zoom");
    new PinchZoom(el, {
      tapZoomFactor: 4,

      onDoubleTap: (pinch, event) => {
        event.preventDefault();
        console.log(pinch, event);
      },
    });

    this.timer = setInterval(() => {
      if (this.pendingChanges) {
        this.saveChanges(this.currentWeek);
      }
    }, 60000); // save once per minute

    var header = $(this.$refs.header);
    $(document).on("mousedown touchstart", (e) => {
      if ($(header).parent().has(e.target).length == 0) {
        this.editingHeader = false;
      }
    });
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
        this.loadPlanner(newVal);
      },
      // https://vuejs.org/guide/essentials/watchers.html#eager-watchers
      immediate: true,
    },
  },
  methods: {
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
          opacity: 1,
          dim: {
            w: 174,
            h: 50,
          },
          font: {
            bold: false,
            size: 34,
            family: "Shadows Into Light Two",
            color: "#000000",
          },
          rotation: 0,
          align: "center",
          border: {
            on: false,
            inset: 5,
            width: 5,
            style: "solid",
            color: "#FFFFFF",
          },
        },
      });
      // https://stackoverflow.com/questions/59749325/vue-set-focus-to-dynamic-input-box
      this.$nextTick(() => {
        console.log($(this.$refs[`text-${newLength - 1}`][0]));
        this.$refs[`text-${newLength - 1}`][0].focus();
        this.$refs[`text-${newLength - 1}`][0].click();
        // $("#text-" + (this.texts.length - 1)).focus();
        // $("#text-" + (this.texts.length - 1)).click();
      });
      this.hideModal();
    },
    addToDo() {
      let newLength = this.stickers.push({
        properties: {
          // text: "To Do 1\nTo Do 2\nTo Do 3",
          items: [],
          pos: this.modalProps.pos,
          opacity: 1,
          dim: {
            w: 174,
            h: 50,
          },
          font: {
            bold: false,
            size: 40,
            family: "Waiting for the Sunrise",
            color: "#000000",
          },
          rotation: 0,
          border: {
            on: false,
            inset: 5,
            width: 5,
            style: "solid",
            color: "#FFFFFF",
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
        // type: sticker.type,
        properties: {
          // position: sticker.position,
          // colors: sticker.colors,
          pos: this.modalProps.pos,
          opacity: 1,
          scale: 0,
          rotation: 0,
          border: {
            on: false,
            inset: 5,
            width: 5,
            style: "solid",
            color: "#FFFFFF",
          },
          ...sticker,
        },
      });
      console.log(this.stickers);
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
        text.properties.dim.h =
          element.scrollHeight +
          2 *
            (text.properties.border.width + text.properties.border.inset) *
            text.properties.border.on;
        element.style.height = "100%";
      });
    },
    async createPng() {
      let el = this.$refs.planner;
      this.output = (await html2canvas(el)).toDataURL("image/jpeg", 0.1);
    },
    async loadTemplate(week) {
      let existingStickers = this.stickers;
      await this.loadPlanner(week);
      this.stickers = this.stickers.concat(existingStickers);
      await this.saveChanges(this.currentWeek);
      this.toggleTemplate();
    },
    async loadPlanner(week) {
      this.showingCalendar = false;
      this.focusedSticker = null;
      this.pageLoaded = false;
      this.texts = null;
      this.todos = null;
      this.stickers = null;

      if (week) {
        const docRef = doc(db, "users", auth.currentUser.uid, "planner", week);
        const docSnap = await getDoc(docRef);

        var res = docSnap.data();

        this.pageLoaded = true;

        console.log(res);

        this.texts = res?.text || [];
        this.todos = res?.todo || [];
        this.stickers = res?.stickers || [];
        this.headerSettings = res?.header || {
          month: {
            color: "#000000",
            family: "Montserrat",
            size: 40,
            bold: false,
          },
          day: {
            color: "#000000",
            family: "Amatic SC",
            size: 40,
            bold: true,
          },
        };

        this.texts = this.texts.map((text) => {
          return { properties: { ...text.properties, text: text.text } };
        });
        this.stickers = this.stickers.concat(this.texts).concat(this.todos);
        this.texts = null;
        this.todos = null;
        console.log(this.stickers);

        this.stickers = this.stickers.map((sticker) => {
          return { properties: sticker.properties || sticker };
        });

        // this.stickers = this.stickers.filter(
        //   (sticker) => sticker.properties.type !== "\u26BD"
        // );

        this.stickers.forEach((sticker) => {
          if (sticker.properties.dimensions) {
            sticker.properties.dim = {
              w: sticker.properties.dimensions.width,
              h: sticker.properties.dimensions.height,
              ...(sticker.properties.dimensions.ratio && {
                r: sticker.properties.dimensions.ratio,
              }),
            };

            delete sticker.properties.dimensions;
          }

          if (sticker.properties.position) {
            sticker.properties.pos = {
              x: sticker.properties.position.left,
              y: sticker.properties.position.top,
            };

            delete sticker.properties.position;
          }
        });

        // this.stickers.forEach((sticker) => {
        //   // sticker.properties.scale = sticker.properties.scale || 1;
        //   sticker.properties.rotation = sticker.properties.rotation || 0;
        //   sticker.properties.align = sticker.properties.align || "center";
        //   delete sticker.properties.align;
        //   // delete sticker.rotation;
        // }); // assign default value

        // this.focusedSticker = this.stickers[0];
        // console.log(this.focusedSticker);

        this.$nextTick(() => {
          this.pendingChanges = false;
        });
      }
    },
    async clearPlanner() {
      if (confirm("Clear all stickers from planner?")) {
        await deleteDoc(
          doc(db, "users", auth.currentUser.uid, "planner", this.currentWeek)
        );
        await this.loadPlanner(this.currentWeek);
      }
    },
    async saveChanges(week) {
      if (this.pageLoaded) {
        this.saveStatus = "saving";
        try {
          console.log(week);
          console.log(
            this.stickers
              .map((item) => item.properties)
              .filter(
                (item) =>
                  item.text !== "" ||
                  item.items?.length > 0 ||
                  item.type !== "" ||
                  item.icon !== ""
              )
          );
          await setDoc(
            doc(db, "users", auth.currentUser.uid, "planner", week),
            {
              header: this.headerSettings,
              // text: this.texts.filter((item) => item.text !== ""),
              // todo: this.todos,
              stickers: this.stickers
                .map((item) => item.properties)
                .filter(
                  (item) =>
                    item.text !== "" ||
                    item.items?.length > 0 ||
                    item.type !== "" ||
                    item.icon !== ""
                ),
            }
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
    toggleTemplate() {
      this.showingTemplate = !this.showingTemplate;
    },
    toggleColors() {
      this.showingColors = !this.showingColors;
    },
    toggleCalendar() {
      this.showingCalendar = !this.showingCalendar;
    },
  },
  computed: {
    allColors() {
      return this.stickers
        .map((sticker) => {
          const colors = sticker.properties.colors || [];
          const fontColor = sticker.properties.font?.color || [];
          return colors.concat(fontColor);
        })
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);
    },
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
