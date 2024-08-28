import { useIntersectionObserver } from "@vueuse/core";
const box3Target = ref(null); // 目标元素的引用
// 使用 IntersectionObserver 监听目标元素是否进入视口
const { stop } = useIntersectionObserver(box3Target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    // 获取数据
    loadData03();
    // 停止监听，避免重复加载
    stop();
  } else {
    console.log("视图不可见");
  }
});
