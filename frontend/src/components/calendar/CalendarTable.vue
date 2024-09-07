<template>
  <table class="calendar-table">
    <thead>
    <tr>
      <th v-for="header in headers" :key="header">{{ header }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in rows" :key="row.id">
      <td v-for="column in row.columns" :key="column.key">
        {{ column.render }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.calendar-table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-table th, .calendar-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.calendar-table th {
  background-color: #f9f9f9;
}

.calendar-table td {
  height: 50px;
  vertical-align: middle;
}
</style>
