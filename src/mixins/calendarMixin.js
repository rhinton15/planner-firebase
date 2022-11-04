export default {
  methods: {
    calendarDates(year, month) {
      // https://stackoverflow.com/questions/222309/calculate-last-day-of-month
      const lastDayPrevMonth = new Date(year, month - 1, 0).getDate(); // month-1 is current month -> months range from 0-11
      const prevMonthDays = (new Date(year, month - 1).getDay() + 6) % 7;
      const curMonthDays = new Date(year, month, 0).getDate();
      const daysInCalendar = Math.ceil((prevMonthDays + curMonthDays) / 7) * 7;
      const nextMonthDays = daysInCalendar - prevMonthDays - curMonthDays;

      // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
      var prevMonthDates = [...Array(prevMonthDays).keys()].map(
        (i) => i - prevMonthDays + lastDayPrevMonth + 1
      );
      var currentMonthDates = [...Array(curMonthDays).keys()].map((i) => i + 1);
      var nextMonthDates = [...Array(nextMonthDays).keys()].map((i) => i + 1);

      return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
    },
  },
};
