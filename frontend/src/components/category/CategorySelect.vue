<template>
  <div>
    <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
      <option v-for="category in categories" :value="category.categoryCode" :key="category.categoryCode">
        {{ category.categoryName }} ({{ category.categoryType }})
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
select {
  width: 100%;
  padding: 5px;
  margin: 5px 0;
}
</style>
