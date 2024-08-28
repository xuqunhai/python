import { useIntersectionObserver } from '@vueuse/core';

const imgLazy = {
  mounted(el) {
    // 图片懒加载：一开始不加载，等到将要看到时再加载

    // 1. 缓存当前的图片路径
    const catchSrc = el.src;
    console.log(catchSrc);

    // 2. 把 img.src 变为占位图
    el.src = 'https://res.lgdsunday.club/img-load.png';

    // 3. 监听将要看到
    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 4. 渲染图片
        el.src = catchSrc;

        // 5. 停止监听
        stop();
      }
    });
  },
};

export default imgLazy;
