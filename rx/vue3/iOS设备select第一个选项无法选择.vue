/**
背景
在 iOS 设备上，如果 <select> 元素最初处于未选中状态，用户选择第一个选项时不会触发 change 事件。这会导致用户不能选择第一个选项。
解决方案
建议在 <select> 元素中提供一个禁用的空选项。这样可以确保 <select> 元素有一个默认选中的选项，避免初始值与任何选项不匹配的情况。
 */
<template>
  <div>
    <label for="exampleSelect">Choose an option:</label>
    <select v-model="selectedOption" id="exampleSelect">
      <option disabled value="">Please select an option</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: "",
    };
  },
};
</script>
