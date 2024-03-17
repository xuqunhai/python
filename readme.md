# 在macbook中如何查看python的安装目录
which python/which python3

# which python3返回的是/usr/local/bin/python3，那安装目录在哪
通常是一个指向Python安装的实际位置的符号链接。要找到Python的实际安装目录，你可以在终端中使用以下命令：
readlink -f /usr/local/bin/python3
如果 readlink -f 不起作用，你可以尝试：
ls -l /usr/local/bin/python3
```
xuqunhai@xuqunhaideMacBook-Pro bin % ls -l /usr/local/bin/python3
lrwxr-xr-x  1 root  wheel  70  1 31 21:40 /usr/local/bin/python3 -> ../../../Library/Frameworks/Python.framework/Versions/3.12/bin/python3
```

# Python和npm在安装依赖包方面的不同点主要包括：
管理系统：Python使用pip作为包管理器，而Node.js使用npm。
安装位置：pip默认将包安装到系统的site-packages目录下，npm则将包安装到当前项目的node_modules目录下。
依赖关系：pip安装时不会自动更新依赖项，而npm在安装包时会自动下载所需的所有依赖。
版本控制：pip依赖于requirements.txt来管理项目依赖，而npm使用package.json和package-lock.json文件。
环境隔离：在Python中，通常使用virtual environments来隔离不同项目的环境，而在Node.js中，则通常依赖于本地安装管理依赖关系，少用隔离环境。

# 系统的site-packages目录如果不同项目同一个依赖包版本不同，则后面项目会覆盖前面，怎么解决
解决方案就是每个项目创建一个虚拟环境，这样每个项目都有自己的site-packages目录

# 基础交互
a = input("请输入")
print(type(a))
b = int(a)
print(type(b))

# 基础数据类型
- int、float、bool
- str
- list
- tuple
- set
- dict
- bytes
- 运算符
- 文件操作