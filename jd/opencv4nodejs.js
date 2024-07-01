const cv = require('opencv4nodejs');
const path = require('path');

function matchSlider(backgroundPath, sliderPath) {
  // 读取背景图像和滑块图像
  const background = cv.imread(backgroundPath);
  const slider = cv.imread(sliderPath);
  console.log('read finish');

  // 转换为灰度图像
  const backgroundGray = background.bgrToGray();
  const sliderGray = slider.bgrToGray();
  console.log('gray finish');

  // 边缘检测
  const backgroundEdges = backgroundGray.canny(50, 150);
  const sliderEdges = sliderGray.canny(50, 150);
  console.log('Canny finish');

  // 模板匹配
  const result = backgroundEdges.matchTemplate(sliderEdges, cv.TM_CCOEFF_NORMED);
  console.log('matchTemplate finish');

  // 找到最佳匹配位置
  const minMax = result.minMaxLoc();
  const maxLoc = minMax.maxLoc;
  console.log('minMaxLoc finish');

  // 获取滑块应该移动的距离
  const topLeft = maxLoc;
  const sliderHeight = slider.rows;
  const sliderWidth = slider.cols;
  const moveDistance = topLeft.x;
  console.log(`move_distance: ${moveDistance}`);

  // 在背景图像上标注匹配位置
  const bottomRight = new cv.Point(topLeft.x + sliderWidth, topLeft.y + sliderHeight);
  background.drawRectangle(topLeft, bottomRight, new cv.Vec(0, 255, 0), 2);
  console.log('rectangle finish');

  // 显示标注后的背景图像
  cv.imshow('Detected', background);
  console.log('imshow finish');
  cv.waitKey();
  console.log('waitKey finish');
  cv.destroyAllWindows();
  console.log('destroyAllWindows finish');

  return moveDistance;
}

// 测试函数
const backgroundPath = path.resolve(__dirname, 'background.png');
const sliderPath = path.resolve(__dirname, 'slider.png');
const moveDistance = matchSlider(backgroundPath, sliderPath);
console.log(`Slider should be moved by ${moveDistance} pixels`);
