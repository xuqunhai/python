import { useIntersectionObserver } from "@vueuse/core";

export default {
  setup() {
    const box3Target = ref(null); // 目标元素的引用

    // 使用 IntersectionObserver 监听目标元素是否进入视口
    const { stop } = useIntersectionObserver(
      box3Target,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          console.log("视图可见");

          // 获取数据
          loadData03();

          // 停止监听，避免重复加载
          stop();
        } else {
          console.log("视图不可见");
        }
      }
    );

    // 模拟数据加载函数
    function loadData03() {
      console.log("加载数据...");
      // 在这里实现数据加载逻辑
    }

    return {
      box3Target,
    };
  },
};
