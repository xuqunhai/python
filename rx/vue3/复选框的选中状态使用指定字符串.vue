/**
在 Vue 3 中，true-value 和 false-value 属性用于 <input type="checkbox"> 元素，以自定义 v-model 绑定时的真值和假值。这在需要使用非布尔值表示选中状态时非常有用。例如，当需要使用特定字符串或数字来表示复选框的选中和未选中状态时，可以使用 true-value 和 false-value。
 */
<template>
  <div>
    <label>
      <input
        type="checkbox"
        v-model="accepted"
        :true-value="'yes'"
        :false-value="'no'"
      />
      Do you accept the terms?
    </label>
    <p>Accepted: {{ accepted }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accepted: "no",
    };
  },
};
</script>
