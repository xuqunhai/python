import cv2
import os

# import numpy as np

def match_slider(background_path, slider_path):
    # 读取背景图像和滑块图像
    background = cv2.imread(background_path)
    slider = cv2.imread(slider_path)
    print('read finish')
    # 转换为灰度图像
    background_gray = cv2.cvtColor(background, cv2.COLOR_BGR2GRAY)
    slider_gray = cv2.cvtColor(slider, cv2.COLOR_BGR2GRAY)
    print('gray finish')

    # 边缘检测
    background_edges = cv2.Canny(background_gray, 50, 150)
    slider_edges = cv2.Canny(slider_gray, 50, 150)
    print('Canny finish')

    # 模板匹配
    result = cv2.matchTemplate(background_edges, slider_edges, cv2.TM_CCOEFF_NORMED)
    print('matchTemplate finish')

    # 找到最佳匹配位置
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    print('minMaxLoc finish')

    # 获取滑块应该移动的距离
    top_left = max_loc
    slider_height, slider_width = slider.shape[:2]
    move_distance = top_left[0]
    print(f'move_distance: ${move_distance}')

    # 在背景图像上标注匹配位置
    bottom_right = (top_left[0] + slider_width, top_left[1] + slider_height)
    cv2.rectangle(background, top_left, bottom_right, (0, 255, 0), 2)
    print('rectangle finish')

    # 显示标注后的背景图像
    cv2.imshow('Detected', background)
    print('imshow finish')
    cv2.waitKey(0)
    print('waitKey finish')
    cv2.destroyAllWindows()
    print('destroyAllWindows finish')

    return move_distance

background_path = './jd/background.png'
slider_path = './jd/w242slider.png'

if not os.path.isfile(background_path):
    print(f"File not found: {background_path}")
else:
    distance = match_slider(background_path, slider_path)
    print(f'Slider should be moved by {distance} pixels')

# w * 242 / 360