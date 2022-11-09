<template>
  <!-- <div> -->
  <div class="m-auto position-relative" ref="page">
    <div class="d-inline-flex">
      <calendar-select v-model="currentWeek"></calendar-select>
      <div class="d-flex flex-column" ref="planner">
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-default fs-2" @click="prevWeek">
            <font-awesome-icon icon="fa-solid fa-chevron-left" />
          </button>
          <h1>
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
          <button class="btn btn-default fs-2" @click="nextWeek">
            <font-awesome-icon icon="fa-solid fa-chevron-right" />
          </button>
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
              @addText="addText"
              @addToDo="addToDo"
              @addSticker="addSticker"
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
            @moveToFront="moveToFront"
            @moveUp="moveUp"
            @moveDown="moveDown"
            @moveToBack="moveToBack"
            @duplicate="(index) => duplicate('sticker', stickers, index)"
          >
            <svg-sticker
              :scale="sticker.properties.scale"
              :colors="sticker.properties.colors"
              :name="sticker.type"
            ></svg-sticker>
          </sticker>
          <sticker
            :id="index"
            v-for="(text, index) in texts"
            :key="text"
            :snapHeight="cellHeight"
            v-model="text.properties"
            @delete="deleteText"
            @update:modelValue="auto_grow($refs[`text-${index}`][0], text)"
          >
            <template #text>
              <textarea
                :ref="'text-' + index"
                :style="{
                  color: text.properties.font.color,
                  fontFamily: text.properties.font.family,
                  fontWeight: 400,
                  fontSize: text.properties.font.size + 'px !important',
                  resize: 'none',
                  width:
                    text.properties.dimensions.width -
                    2 *
                      (text.properties.border.width +
                        text.properties.border.inset) *
                      text.properties.border.on +
                    'px',
                  height: '100%',
                }"
                :colors="text.properties.colors"
                :class="`text-${
                  text.properties.align
                } fs-1 border-0 bg-transparent textwhite overflow-hidden ${
                  text.properties.font.bold ? 'fw-bold' : ''
                }`"
                v-model="text.text"
                @input="auto_grow($event.target, text)"
              ></textarea>
            </template>
          </sticker>
          <sticker
            :id="index"
            v-for="(text, index) in todos"
            :key="text"
            :snapHeight="cellHeight"
            v-model="text.properties"
            @delete="deleteToDo"
          >
            <to-do-list v-model="text.properties"></to-do-list>
          </sticker>
        </div>
      </div>
    </div>
  </div>
  <!-- <button class="btn btn-outline-primary" @click="createPng">
      Screenshot
    </button>
    <a id="downloadLnk" download="screenshot.jpeg" :href="output"
      >Download as image</a
    >
    <img :src="output" style="width: 250px" /> -->
  <!-- </div> -->
</template>

<script>
import CalendarSelect from "../components/CalendarSelect.vue";
import PlannerMonth from "../components/PlannerMonth.vue";
import PlannerDay from "../components/PlannerDay.vue";
import Sticker from "../components/Sticker.vue";
import SvgSticker from "../components/SvgSticker.vue";
import ToDoList from "../components/ToDoList.vue";

import html2canvas from "html2canvas";

// import { auth, db, functions } from "../firebase";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// import { httpsCallable } from "firebase/functions";

export default {
  components: {
    PlannerMonth,
    PlannerDay,
    Sticker,
    SvgSticker,
    CalendarSelect,
    ToDoList,
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

    // const addAdmin = httpsCallable(functions, "addAdmin");
    // await addAdmin({ email: "rhinton14@gmail.com" });
  },
  async mounted() {
    this.timer = setInterval(() => {
      if (this.pendingChanges) {
        this.saveChanges(this.currentWeek);
      }
    }, 10000);
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
    currentWeek: {
      handler: function (newVal, oldVal) {
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
    addText(position) {
      let newLength = this.texts.push({
        text: "",
        properties: {
          position: position,
          opacity: 1,
          dimensions: {
            width: 174,
            height: 50,
          },
          font: {
            bold: false,
            size: 40,
            family: "Amatic SC",
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
        this.$refs[`text-${newLength - 1}`][0].focus();
        this.$refs[`text-${newLength - 1}`][0].click();
        // $("#text-" + (this.texts.length - 1)).focus();
        // $("#text-" + (this.texts.length - 1)).click();
      });
    },
    addToDo(position) {
      this.todos.push({
        properties: {
          text: "To Do 1\nTo Do 2\nTo Do 3",
          position: position,
          opacity: 1,
          dimensions: {
            width: 174,
            height: 290,
          },
          font: {
            bold: false,
            size: 40,
            family: "Amatic SC",
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
    },
    addSticker(sticker) {
      this.stickers.push({
        type: sticker.type,
        properties: {
          // position: sticker.position,
          // colors: sticker.colors,
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
      item.properties.position.left += 25;
      item.properties.position.top += 25;
      const newLength = ary.push(item);

      this.$nextTick(() => {
        this.$refs[`${refPrefix}-${newLength - 1}`][0].click();
      });
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
        text.properties.dimensions.height =
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
    async loadPlanner(week) {
      this.pageLoaded = false;
      this.texts = null;
      this.todos = null;
      this.stickers = null;

      if (week) {
        const docRef = doc(db, "users", auth.currentUser.uid, "planner", week);
        const docSnap = await getDoc(docRef);

        var res = docSnap.data();

        this.pageLoaded = true;

        this.texts = res?.text || [];
        this.todos = res?.todo || [];
        this.stickers = res?.stickers || [];

        this.stickers.forEach((sticker) => {
          // sticker.properties.scale = sticker.properties.scale || 1;
          sticker.properties.rotation = sticker.properties.rotation || 0;
          sticker.properties.align = sticker.properties.align || "center";
          // delete sticker.rotation;
        }); // assign default value
      }
    },
    async saveChanges(week) {
      if (this.pageLoaded) {
        await setDoc(doc(db, "users", auth.currentUser.uid, "planner", week), {
          text: this.texts,
          todo: this.todos,
          stickers: this.stickers,
        });
        this.pendingChanges = false;
      }
    },
  },
  computed: {
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
