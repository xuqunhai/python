import threading
import time

def run():
  time.sleep(2)  # 假设在此进行了一些处理
  print('run')

t1 = time.time()
thr_list = []
for i in range(5):
  thr = threading.Thread(target=run)
  thr.start()
  thr.join()
print(time.time() - t1) # 10.021262168884277

# 上面写法多线程会串行
# 需要并行的话，要用下面写法

t2 = time.time()
thr_list2 = []
for i in range(5):
  thr2 = threading.Thread(target=run)
  thr2.start()
  thr_list2.append(thr2)
for i in thr_list2:
  thr2.join()
print(time.time() - t2) # 2.005704879760742