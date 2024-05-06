import time


def copy_file(path, topath):
    with open(path, "rb") as fp1:
        with open(topath, "wb") as fp2:
            while 1:
                info = fp1.read(1024) # 读取最多1024字节的数据。这里1024字节的选择是为了平衡内存使用和效率。
                if not info:
                    break
                else:
                    fp2.write(info)
                    fp2.flush() # 确保所有写入的数据被立即写到磁盘上，这个步骤可以提高数据的写入安全性，确保即使发生错误也不会丢失太多数据。


if __name__ == "__main__":
    t1 = time.time()

    for i in range(1, 5):
        path = r"D:\桌面\src\%d.mp4" % i
        toPath = r"D:\桌面\des\%d.mp4" % i
        copy_file(path, toPath)

    t2 = time.time()
    # 貌似单进程复制文件更快
    print("单进程耗时：%.2f" % (t2 - t1))
