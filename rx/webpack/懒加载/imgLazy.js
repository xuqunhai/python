import { useIntersectionObserver } from "@vueuse/core";
const catchSrc = el.src;
el.src = "img-load.png";
const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    el.src = catchSrc;
    stop(); // 停止监听
  }
});

// 1、缓存当前的图片路径
// 2、把 img.src 变为占位图
// 3、监听将要看到后再渲染图片
