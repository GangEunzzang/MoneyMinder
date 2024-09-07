<template>
  <div>
    <CalendarTable :headers="headers" :rows="rows" />
  </div>
</template>

<script>
import CalendarTable from "@/components/calendar/CalendarTable.vue";

export default {
  components: {
    CalendarTable,
  },
  data() {
    return {
      headers: ['일', '월', '화', '수', '목', '금', '토'],
    };
  },
  computed: {
    rows() {
      return this.generateCalendarRows(2024, 8); // 원하는 연도와 달 설정
    },
  },
  methods: {
    getMonthInfo(year, month) {
      const startDay = new Date(year, month - 1, 1).getDay();
      const endDate = new Date(year, month, 0).getDate();
      return { startDay, endDate };
    },
    calendarGenerator(year, month) {
      const { endDate, startDay } = this.getMonthInfo(year, month);
      const weekNumber = Math.ceil((startDay + endDate) / 7);
      const calendar = [];
      let nowDate = 0;
      let nowDay = 0;

      for (let i = 0; i < weekNumber; i++) {
        const nowWeek = [];
        for (let j = 0; j < 7; j++) {
          if (startDay <= nowDay && nowDate < endDate) {
            nowDate++;
            nowWeek.push(nowDate);
          } else {
            nowWeek.push(0); // 빈칸을 표시하기 위해 0을 넣음
          }
          nowDay++;
        }
        calendar.push(nowWeek);
      }

      return calendar;
    },
    generateCalendarRows(year, month) {
      const datas = this.calendarGenerator(year, month);
      const components = [];

      datas.forEach((week, idx) => {
        const weeks = [];

        week.forEach((date, idx) => {
          weeks.push({
            key: date ? date : idx,
            render: date ? date : '',
          });
        });

        const weekData = {
          id: `week_${idx}`,
          columns: weeks,
        };

        components.push(weekData);
      });

      return components;
    },
  },
};
</script>

<style scoped>
/* 스타일을 추가할 경우 이곳에 */
</style>
