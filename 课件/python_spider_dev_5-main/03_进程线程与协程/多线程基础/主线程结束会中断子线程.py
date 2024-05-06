import _thread # 引入线程的模块，比较老的模块，新的模块是 threading
from PyQt5.QtWidgets import QApplication, QMessageBox, QPushButton, QWidget
import time

def run():
  time.sleep(2)  # 假设在此进行了一些处理
  print('run')

_thread.start_new_thread(run, ()) # 主线程执行完毕，子线程会死掉
print('over')

# # 主线程执行完毕，子线程会死掉,没有下面2行，上面代码只打印over
# 打开下面2行，先打印over，2秒后打印run
while True:
  pass