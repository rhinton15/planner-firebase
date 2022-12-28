<template>
  <div style="font-size: 12px; width: 224px">
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-default" @click="prevMonth">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </button>
      <!-- https://stackoverflow.com/questions/1643320/get-month-name-from-date -->
      <div
        :class="`align-self-stretch w-100 month rounded ${
          modelValue === `${year}-${month + 1}` ? 'selected' : ''
        }`"
        @click="selectMonth"
      >
        <div class="h-100 d-flex flex-column justify-content-center">
          {{
            new Date(year, month).toLocaleString("default", {
              month: "long",
            })
          }}
          {{ year }}
        </div>
      </div>
      <button class="btn btn-default" @click="nextMonth">
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </button>
    </div>
    <table class="table table-borderless w-auto d-block">
      <thead>
        <tr class="border-bottom">
          <td>M</td>
          <td>T</td>
          <td>W</td>
          <td>T</td>
          <td>F</td>
          <td>S</td>
          <td>S</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="week in dates.length / 7"
          :key="week"
          :class="'week ' + (week === selectedWeek ? 'selected ' : '')"
          @click="selectWeek(week)"
        >
          <td
            v-for="day in 7"
            :key="day"
            :class="
              'p-1 ' +
              ((week == 1 && dates[(week - 1) * 7 + day - 1] > 7) ||
              (week >= 4 && dates[(week - 1) * 7 + day - 1] <= 7)
                ? 'text-gray '
                : '') +
              (day == 1 ? 'rounded-start ' : day == 7 ? 'rounded-end ' : '')
            "
          >
            <div
              :class="
                'day p-1 ' +
                ((week - 1) * 7 + day === today
                  ? 'bg-dark text-white rounded-circle '
                  : '')
              "
            >
              {{ dates[(week - 1) * 7 + day - 1] }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import calendarMixin from "../mixins/calendarMixin";

export default {
  mixins: [calendarMixin],
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      month: null,
      year: null,
    };
  },
  methods: {
    selectWeek(week) {
      let newDate;
      if (week === 1) {
        newDate = `${this.firstDayCalendar.getFullYear()}-${
          this.firstDayCalendar.getMonth() + 1
        }-${this.firstDayCalendar.getDate()}`;
      } else {
        newDate = `${this.year}-${this.month + 1}-${
          this.dates[(week - 1) * 7]
        }`;
      }
      this.$emit("update:modelValue", newDate);
    },
    selectMonth() {
      this.$emit("update:modelValue", `${this.year}-${this.month + 1}`);
    },
    nextMonth() {
      this.month++;
      if (this.month === 12) {
        this.month = 0;
        this.year++;
      }
    },
    prevMonth() {
      this.month--;
      if (this.month === -1) {
        this.month = 11;
        this.year--;
      }
    },
  },
  computed: {
    formattedDate() {
      const parts = this.modelValue.split("-");
      if (parts.length > 0) {
        const year = parts[0];
        if (parts.length > 1) {
          let month = parts[1];
          if (month.length == 1) month = "0" + month;
          if (parts.length > 2) {
            let day = parts[2];
            if (day.length == 1) day = "0" + day;
            return `${year}-${month}-${day}`;
          } else {
            return `${year}-${month}`;
          }
        } else {
          return year;
        }
      } else {
        return "";
      }
    },
    selectedDate() {
      // https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
      if (this.formattedDate.match(/-/g).length === 1) return null;
      var date = new Date(this.formattedDate);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset);
    },
    firstDayCalendar() {
      const prevMonthDays = this.dates
        .slice(0, 7)
        .filter((date) => date > 7).length;
      return new Date(this.year, this.month, 1 - prevMonthDays);
    },
    today() {
      var today = new Date();
      // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
      return Math.round(
        (new Date(today.getFullYear(), today.getMonth(), today.getDate()) -
          this.firstDayCalendar) /
          (1000 * 60 * 60 * 24) +
          1
      );
    },
    selectedWeek() {
      return (
        Math.floor(
          (this.selectedDate - this.firstDayCalendar) /
            (1000 * 60 * 60 * 24) /
            7
        ) + 1
      );
    },
    dates() {
      return this.calendarDates(this.year, this.month + 1);
    },
  },
  created() {
    var date = new Date(this.formattedDate);
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    var today = new Date(date.getTime() + userTimezoneOffset);

    this.month = today.getMonth();
    this.year = today.getFullYear();
  },
};
</script>

<style scoped>
.text-gray {
  color: #979797 !important;
}

.month:hover,
tr.week:hover {
  background-color: #eaeaea;
}

.month.selected,
tr.week.selected {
  background-color: #cdcdcd;
}

.day {
  width: 24px;
  height: 24px;
}
</style>
