# a = input("请输入")
# print(type(a)) # <class 'str'>
# b = int(a)
# print(type(b)) # <class 'int'>

# 注释
# '''
# xxx
# '''

# if第一种写法
# if b > 100:
#   print('播哥')
# print('播个球')

# if第二种写法
# if a > 100:
#   print('666')
# else:
#   print('lj')
# # TypeError: '>' not supported between instances of 'str' and 'int'

# # if第3种写法嵌套
# if b > 1000:
#   if b > 5000:
#     print('svip')
#   else:
#     print('vip')
# else:
#   print('normal')

# # if第4种写法
# if b > 5000:
#   print('svip')
# elif b > 1000:
#   print('vip')
# elif b > 100:
#   print('normal')
# else:
#   print('none')

# while True:
#   print('死循环')

# a = []
# b = None
# c = {}
# d = set()
# e = tuple()
# if a:
#   print(1)
# elif b:
#   print(2)
# elif c:
#   print(3)
# elif d:
#   print(4)
# elif e:
#   print(5)
# else:
#   print(6)
# # 6

# i = 1
# s = 0
# while i <= 5:
#   s = s + i
#   i = i + 1
# print(s)

# break停止循环，continue结束当前循环，直接进入下一轮循环

# for循环 - 可迭代
# s= 'raferxu'
# for c in s:
#   print(c)

# for c in range(3, 10): # 3-9
#   print(c)

# ls1 = [1,2]
# tp1 = (1,2)
# for item1 in ls1:
#   print(item1) # 1 2
# for item2 in tp1:
#   print(item2) # 1 2
# 上面只能获取到val，要想获取索引需用下面方法
# for i in range(len(lst)): # 循环索引

# range(n) 从0到n，不包含n
# range(m, n) 从m到n，不包含n
# range(m, n, s) 从m到n，不包含n，间隔是s

# 关键字pass作用：代码占位
# p = 1
# if p > 10:
#   pass # 如果没想好，空着的话会报错，所以可以用pass占位，这样就不会报错

# 字符串格式化-模版字符串
# name = 'rx'
# s = "my name is %s" % name
# s1 = "my name is {}".format(name)
# s2 = f"my name is {name}" # 常用
# print(s, s1, s2)

# s3 = """我还是一个字符串"""
# print('''我说:"要'上天'"''')
# print("""我说:"要'上天'" """) # 三个引号和前一个要有空格

# 字符串索引和切片（前闭后开）
# s = "我是大哥"
# print(s[-1]) # 哥（最后一个）
# # print(s[5]) # 索引超出范围报错 - IndexError: string index out of range
# print(s[1:2]) # 是
# print(s[0:3]) # 我是大
# print(s[0:4]) # 我是大哥
# print(s[0:-1]) # 我是大
# print(s[0:]) # 我是大哥
# print(s[:]) # 我是大哥
# # s[start:end:step] # step正表示取右边的，负表示取左边
# print(s[::2]) # 我大
# print(s[::-1]) # 哥大是我

# 字符串常规操作
# 一般返回一个新字符串，不会对原字符串产生影响
# s = "ab cd"
# s1 = s.capitalize() # Ab cd 首字母大写
# print(s1)
# s2 = s.title() # Ab Cd 每个单词首字母大写
# print(s2)
# s3 = s.upper() # AB CD 大写
# print(s3)
# s4 = s.lower() # ab cd 小写，处理一些欧洲语言有问题，所以一般推荐都转大写
# print(s4)

# 替换和切割
# s = " 你好， 我 是 詹姆斯 "
# s1 = s.strip() # 去掉左右空格
# print(s1) # [你好， 我 是 詹姆斯]

# s = '   \t\t asdf\r\r  \n\n' # \t缩进 \r回车 \n换行
# print(s.strip()) # asdf

# s2 = s.replace(" ", '')
# print(s2) # 你好，我是詹姆斯

# s3 = s.split("是")
# print(s3) # [' 你好， 我 ', ' 詹姆斯 ']

# 查找和替换
# s = "I am raferxu"
# s1 = s.find('xu')
# print(s1) # 10
# s2 = s.find('r ')
# print(s2) # -1
# s3 = s.index('xu')
# print(s3) # 10
# # s4 = s.index('r ')
# # print(s4) # ValueError: substring not found
# print('xu' in s) # True
# print('xx' not in s) # True
# print(s.startswith('I')) # True
# print(s.endswith('u')) # True

# money = '1'
# print(money.isdigit()) # True
# print(money.isdecimal()) # True
# money2 = '1.1'
# print(money2.isdigit()) # False
# print(money2.isdecimal()) # False

# str = '123'
# print(len(str)) # 3
# str2 = 'abc'
# print(str.join(str2)) # a123b123c
# lst = ['a', 'v']
# print("".join(lst)) # av

# list/tuple
# list是一种有序的集合，可以随时添加和删除其中的元素。
# classmates = ['Michael', 'Bob', 'Tracy']
# print(len(classmates)) # 3
# print(classmates[2]) # Tracy
# # print(classmates[3]) # 当索引超出了范围时，Python会报一个IndexError错误
# print(classmates[-1]) # Tracy

# 列表切片
# lst = [1,2,3,4]
# print(lst[1:3]) # [2, 3]

# # 往list中追加元素到末尾：
# classmates.append('Adam')

# # 把元素插入到指定的位置
# classmates.insert(1, 'Jack')

# # 删除list末尾的元素
# classmates.pop()

# # 删除指定位置的元素，用pop(i)方法
# classmates.pop(1)

# # 把某个元素替换成别的元素
# classmates[1] = 'Sarah'

# # list里面的元素的数据类型也可以不同
# L = ['Apple', 123, True]

# list合并
# ls1 = [1,2]
# ls2 = [3,4]
# ls1.extend(ls2)
# print(ls1) # [1, 2, 3, 4]

# 元组：tuple。tuple和list非常类似，但是tuple一旦初始化就不能修改
# tuple不能变了，它也没有append()，insert()这样的方法。
# 因为tuple不可变，所以代码更安全
# classmates = ('Michael', 'Bob', 'Tracy')
# a = ()
# t1 = (1) # 不是tuple，是1这个数！
# d = (3,) # 只有1个元素的tuple定义时必须加一个逗号,，来消除歧义.因为括号()既可以表示tuple，又可以表示数学公式中的小括号
# e = (4,5,6)
# t = ('a', 'b', ['A', 'B'])
# t[2][0] = 'X' # 其实变的不是tuple的元素，而是list的元素。tuple的每个元素，指向永远不变。

# if-elif-else
# h = 1.55
# w = 70.5
# bmi = w/(h*h)
# if bmi<18.5:
#   print('qing')
# elif bmi<25:
#   print('normal')
# elif bmi<28:
#   print('less fat')
# elif bmi<32:
#   print('fat')
# else:
#   print('too fat')

# 用if ... elif ... elif ... else ...判断时，会写很长一串代码，可读性较差。
# 针对某个变量匹配若干种情况，可以使用match语句。
# score = 'B'
# match score:
#   case 'A':
#     print('A')
#   case 'B':
#     print('B')
#   case 'C':
#     print('C')
#   case _: # _表示匹配到其他任何情况 - 在最后（且仅能在最后）加一个case _表示“任意值”
#     print('???')

# match复杂匹配
# age = 16 # not sure
# match age:
#   case x if x < 10: # 当age < 10成立时匹配，且赋值给变量x
#     print(f'< 10 years old: {x}')
#   case 10:
#     print('10 years old')
#   case 11 | 12 | 13 | 14 | 15:
#     print('11~15 years old')
#   case 19:
#     print('19 years old')
#   case _:
#     print('not sure')

# match复杂匹配2
# args = ['gcc', 'hello.c', 'world.c']
# match args:
#     # 如果仅出现gcc，报错:
#     case ['gcc']:
#         print('gcc: missing source file(s).')
#     # 出现gcc，且至少指定了一个文件:
#     case ['gcc', file1, *files]:
#         print('gcc compile: ' + file1 + ', ' + ', '.join(files))
#     # 仅出现clean:
#     case ['clean']:
#         print('clean')
#     case _:
#         print('invalid command.')
# # 第二个字符串绑定到变量file1，
# # 后面的任意个字符串绑定到*files（符号*的作用将在函数的参数中讲解），它实际上表示至少指定一个文件；
# # gcc compile: hello.c, world.c

# 循环 - 让计算机能计算成千上万次的重复运算
# 一种是for...in循环，依次把list或tuple中的每个元素迭代出来
# sum = 0
# for x in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
#   sum = sum + x
# print(sum) # 55

# 如果要计算1-100的整数之和，从1写到100有点困难，
# 提供一个range()函数，可以生成一个整数序列，再通过list()函数可以转换为list。
# range(101)就可以生成0-100的整数序列，
# sum = 0
# for x in range(101):
#   sum = sum + x
# print(sum) # 5050

# 第二种循环是while循环，只要条件满足，就不断循环，条件不满足时退出循环。
# 计算100以内所有奇数之和
# sum = 0
# n = 99
# while n > 0:
#   sum = sum + n
#   n = n - 2
# print(sum) # 2500

# break的作用是提前结束循环。
# continue语句，跳过当前的这次循环，直接开始下一次循环。
# 只打印奇数 1，3，5，7，9。
# n = 0
# while n < 10:
#   n = n + 1
#   if n % 2 == 0: # 如果n是偶数，执行continue语句
#     continue # continue语句会直接继续下一轮循环，后续的print()语句不会执行
#   print(n)

# 程序陷入“死循环”，这时可以用Ctrl+C退出程序，或者强制结束Python进程。

# 字典：dict的支持，dict全称dictionary 使用键-值（key-value）存储，具有极快的查找速度。
# 查某一个字，一个办法是把字典从第一页往后翻，直到找到我们想要的字为止，这种方法就是在list中查找元素的方法
# 先在字典的索引表里（比如部首表）查这个字对应的页码，然后直接翻到该页，找到这个字。
# dict的key必须是不可变对象。因为dict根据key来计算value的存储位置，算法称为哈希算法（Hash）。
# d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}

# 多次对一个key放入value，后面的值会把前面的值冲掉;如果key不存在，dict就会报错;
# d['Thomas'] # KeyError: 'Thomas'

# 要避免key不存在的错误，有两种办法，一是通过in判断key是否存在
# 'Thomas' in d # False

# 二是通过dict提供的get()方法，如果key不存在，可以返回None，或者自己指定的value
# print(d.get('Thomas')) # None
# print(d.get('Thomas', 123)) # 123

# 删除一个key，用pop(key)方法，
# d.pop('Bob')

# 和list比较，dict有以下几个特点：
# 查找和插入的速度极快，不会随着key的增加而变慢；
# 需要占用大量的内存，内存浪费多。
# 所以，dict是用空间来换取时间的一种方法。

# 在Python中，字符串、整数等都是不可变的，因此，可以放心地作为key。而list是可变的，就不能作为key
# d = {}
# key = [1, 2, 3]
# d[key] = 'a list' # TypeError: unhashable type: 'list'

# set和dict类似，也是一组key的集合，但不存储value。而且key不能重复
# set的原理和dict一样，所以，同样不可以放入可变对象，因为无法判断两个可变对象是否相等，也就无法保证set内部“不会有重复元素”。
# 要创建一个set，需要提供一个list作为输入集合：重复元素在set中自动被过滤
# s = set([1, 1, 2, 2, 3, 3])
# print(s) # {1, 2, 3} # 显示的顺序也不表示set是有序的。

# 通过add(key)方法可以添加元素到set中
# 通过remove(key)方法可以删除元素：

# 两个set可以做数学意义上的交集、并集等操作：
# s1 = set([1, 2, 3])
# s2 = set([2, 3, 4])
# print(s1 & s2) # {2, 3}
# print(s1 | s2) # {1, 2, 3, 4}

# 再议不可变对象 - 最常用的key是字符串。
# 调用a.replace('a', 'A')时，实际上调用方法replace是作用在字符串对象'abc'上的
# 对于不变对象来说，调用对象自身的任意方法，也不会改变该对象自身的内容。相反，这些方法会创建新的对象并返回

# tuple虽然是不变对象
# set((1,2,3)) # 不报错
# set((1,[2,3])) # TypeError: unhashable type: 'list'

# 函数就是最基本的一种代码抽象的方式。不关心底层的具体计算过程，而直接在更高的层次上思考问题。
# 调用一个函数，需要知道函数的名称和参数
# print(abs(-20)) # 20
# 传入参数个数或参数类型不对，会报错
# # abs(1, 2) # TypeError: abs() takes exactly one argument (2 given)
# abs('a') # TypeError: bad operand type for abs(): 'str'
# print(hex(255)) # 0xff 整数转换成十六进制表示的字符串

# 数据类型转换函数
# int('123')
# float('12.34')
# str(1.23)
# bool('')

# 定义函数 - 不像js一样，不存在声明提前
# 使用def语句，依次写出函数名、括号、括号中的参数和冒号:，然后，在缩进块中编写函数体，函数的返回值用return语句返回。
# def my_abs(x):
#     if x >= 0:
#         return x
#     else:
#         return -x
# print(my_abs(-99)) # 99
# 如果没有return语句，函数执行完毕后也会返回结果，只是结果为None。

# 当传入了不恰当的参数时，内置函数abs会检查出参数错误，而我们定义的my_abs没有参数检查
# 修改一下my_abs的定义，对参数类型做检查，只允许整数和浮点数类型的参数。
# def my_abs(x):
#     if not isinstance(x, (int, float)):
#         raise TypeError('bad operand type')
#     if x >= 0:
#         return x
#     else:
#         return -x

# 模块 - import时自动运行对应文件
# import jiamijie as jmj # 使用 jmj.jiami
# from jiamijie import jiami
# from abstest import my_abs来导入my_abs()函数，注意abstest是文件名（不含.py扩展名）

# 内置模块
# # 随机产生一个整数
# import random
# print(random.randint(10, 20))
# # 随机从列表获取内容
# lst = [11, 22]
# print(random.choice(lst))
# # 获取当前时间戳
# import time
# print(time.time()) # 1711725303.7165718，单位秒
# t = int(time.time()*1000)
# # 文件夹创建、判断、路径
# import os
# os.makedirs("a/b/c") # 一次性创建多层文件夹
# p1 = 'a'
# p2 = 'b'
# real_path = os.path.join(p1, p2)
# if not os.path.exists(real_path):
#     os.makedirs(real_path)
# # 把json字符串编程python字典
# s = '{"nane": "rx"}'
# import json
# dic = json.loads(s) # json.load处理的是json文件
# print(dic) # {'nane': 'rx'}
# print(type(dic)) # <class 'dict'>

# 把python字典变成json字符串
# dic = {"a": None, "b": True}
# str = json.dumps(dic)
# print(str) # {"a": null, "b": true}
# print(str(dic)) # {'a': None, 'b': True} - python字符串和json字符串差异

# 空函数
# def nop():
#     pass
# 实际上pass可以用来作为占位符，比如现在还没想好怎么写函数的代码，就可以先放一个pass，让代码能运行起来。
# 缺少了pass，代码运行就会有语法错误。

# 函数可以返回多个值吗？答案是肯定的。但其实就是一个tuple。
# 从一个点移动到另一个点，给出坐标、位移和角度，就可以计算出新的坐标：
# import math # 表示导入math包，并允许后续代码引用math包里的sin
# def move(x, y, step, angle=0):
#     nx = x + step * math.cos(angle)
#     ny = y - step * math.sin(angle)
#     return nx, ny
# x, y = move(100, 100, 60, math.pi / 6)
# print(x, y) # 151.96152422706632 70.0

# 这只是一种假象，Python函数返回的仍然是单一值：Python的函数返回多值其实就是返回一个tuple，
# r = move(100, 100, 60, math.pi / 6)
# print(r) # (151.96152422706632, 70.0)

# 定义一个函数quadratic(a, b, c)，接收3个参数，返回一元二次方程的两个解。
# import math
# def quadratic(a, b, c): # 测试成功
#   m = (-b + math.sqrt(b*b-4*a*c))/(2*a)
#   n = (-b - math.sqrt(b*b-4*a*c))/(2*a)
#   return m,n
# if quadratic(2, 3, 1) != (-0.5, -1.0):
#     print('测试失败')
# elif quadratic(1, 3, -4) != (1.0, -4.0):
#     print('测试失败')
# else:
#     print('测试成功')

# 函数定义非常简单，但灵活度却非常大。除了正常定义的必选参数外，还可以使用默认参数、可变参数和关键字参数

# 位置参数 - 传入的两个值按照位置顺序依次赋给参数x和n
# def power(x, n):
#   s = 1
#   while n > 0:
#     n = n - 1
#     s = s * x
#   return s
# print(power(5, 3)) # 125
# power(5) # TypeError: power() missing 1 required positional argument: 'n'
# # 增加了一个参数，导致旧的代码因为缺少一个参数而无法正常调用：这个时候，默认参数就排上用场了。
# def power(x, n=2): # 必选参数在前，默认参数在后，

# 默认参数降低了函数调用的难度
# def enroll(name, gender, age=6, city='Beijing'):
#     print('name:', name)
#     print('gender:', gender)
#     print('age:', age)
#     print('city:', city)

# 当不按顺序提供部分默认参数时，需要把参数名写上。
# 比如调用enroll('Adam', 'M', city='Tianjin')

# 默认参数很有用，但使用不当，也会掉坑里。
# def add_end(L=[]):
#     L.append('END')
#     return L
# print(add_end()) # ['END']
# print(add_end()) # ['END', 'END']
# # 每次调用该函数，如果改变了L的内容，则下次调用时，默认参数的内容就变了，不再是函数定义时的[]了。
# # 可以用None这个不变对象来实现 无论调用多少次，都不会有问题：
# def add_end(L=None):
#     if L is None:
#         L = []
#     L.append('END')
#     return L
# # 为什么要设计str、None这样的不变对象呢？
# # 因为不变对象一旦创建，对象内部的数据就不能修改，这样就减少了由于修改数据导致的错误。

# 定义可变参数和关键字参数的语法：
# *args是可变参数，args接收的是一个tuple；
# **kw是关键字参数，kw接收的是一个dict。
# 定义命名的关键字参数在没有可变参数的情况下不要忘了写分隔符*，否则定义的将是位置参数。

# 可变参数就是传入的参数个数是可变的，可以是1个、2个到任意个，还可以是0个。
# 仅仅在参数前面加了一个*号。在函数内部，参数numbers接收到的是一个tuple
# 可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个tuple。
# def calc(*numbers):
#     sum = 0
#     for n in numbers:
#         sum = sum + n * n
#     return sum
# print(calc(1, 2)) # 5
# print(calc()) # 0
# nums = [1, 2, 3]
# print(calc(nums[0], nums[1], nums[2])) # 14
# # Python允许你在list或tuple前面加一个*号，把list或tuple的元素变成可变参数传进去
# print(calc(*nums))

# 关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict。
# 除了必选参数name和age外，还接受关键字参数kw
# def person(name, age, **kw):
#     print('name:', name, 'age:', age, 'other:', kw)
# print(person('Adam', 45, gender='M', job='Engineer')) # name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}
# # 正在做一个用户注册的功能，除了用户名和年龄是必填项外，其他都是可选项，利用关键字参数来定义这个函数就能满足注册的需求。
# extra = {'city': 'Beijing', 'job': 'Engineer'}
# print(person('Jack', 24, **extra)) # kw将获得一个dict，注意kw获得的dict是extra的一份拷贝，对kw的改动不会影响到函数外的extra。

# 对于关键字参数，希望检查是否有city和job参数：
# def person(name, age, **kw):
#     if 'city' in kw:
#         # 有city参数
#         pass
#     if 'job' in kw:
#         # 有job参数
#         pass
#     print('name:', name, 'age:', age, 'other:', kw)

# # 要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收city和job作为关键字参数。这种方式定义的函数如下：
# # 和关键字参数**kw不同，命名关键字参数需要一个特殊分隔符*，*后面的参数被视为命名关键字参数。
# def person(name, age, *, city, job):
#     print(name, age, city, job)
# person('Jack', 24, city='Beijing', job='Engineer')

# 如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符*了：
# def person(name, age, *args, city='shenzhen', job):
#     print(name, age, args, city, job)
# # 命名关键字参数必须传入参数名，这和位置参数不同。如果没有传入参数名，调用将报错：
# person('Jack', 24, 'Beijing', 'Engineer') # TypeError: person() missing 2 required keyword-only arguments: 'city' and 'job'
# person('Jack', 24, city='Beijing', job='Engineer') # Jack 24 () Beijing Engineer

# # 由于命名关键字参数city具有默认值，调用时，可不传入city参数
# person('Jack', 24, job='Engineer') # Jack 24 () shenzhen Engineer
    
# 参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。
# 命名关键字参数必须传入参数名
# def f1(a, b, c=0, *args, **kw):
#     print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)
# f1(1, 2, 3, 'a', 'b', x=99)
# # a = 1 b = 2 c = 3 args = ('a', 'b') kw = {'x': 99}

# 命名关键字参数必须传入参数名，如果没有可变参数，就必须加一个*作为特殊分隔符。
# def f2(a, b, c=0, *, d, **kw):
#     print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)
# f2(1, 2, d=99, ext=None)
# # a = 1 b = 2 c = 0 d = 99 kw = {'ext': None}

# 递归函数
# def fact(n):
#   if n==1:
#     return 1
#   return n * fact(n-1)
# print(fact(1)) # 1
# print(fact(5)) # 120

# 递归函数的优点是定义简单，逻辑清晰。
# 使用递归函数需要注意防止栈溢出。
# 在计算机中，函数调用是通过栈（stack）这种数据结构实现的，每当进入一个函数调用，栈就会加一层栈帧，每当函数返回，栈就会减一层栈帧。
# 由于栈的大小不是无限的，所以，递归调用的次数过多，会导致栈溢出。
# fact(1000) # RecursionError: maximum recursion depth exceeded
# # 解决递归调用栈溢出的方法是通过尾递归优化，事实上尾递归和循环的效果是一样的
# # 尾递归是指，在函数返回的时候，调用自身本身，并且，return语句不能包含表达式。
# # 上面的fact(n)函数由于return n * fact(n - 1)引入了乘法表达式，所以就不是尾递归了。
# # 改成尾递归方式，需要多一点代码，主要是要把每一步的乘积传入到递归函数中：
# def fact(n):
#     return fact_iter(n, 1)
# def fact_iter(num, product):
#     if num == 1:
#         return product
#     return fact_iter(num - 1, num * product)
# # fact(5)对应的fact_iter(5, 1)的调用如下：
# #   ===> fact_iter(5, 1)
# #   ===> fact_iter(4, 5)
# #   ===> fact_iter(3, 20)
# #   ===> fact_iter(2, 60)
# #   ===> fact_iter(1, 120)
# #   ===> 120
# # 尾递归调用时，如果做了优化，栈不会增长，因此，无论多少次调用也不会导致栈溢出。
# 遗憾的是，大多数编程语言没有针对尾递归做优化，Python解释器也没有做优化，所以，即使把上面的fact(n)函数改成尾递归方式，也会导致栈溢出

# 利用递归函数移动汉诺塔:
# 大盘叠小盘，不能小盘叠大盘
# n，表示3个柱子A、B、C中第1个柱子A的盘子数量，然后打印出把所有盘子从A借助B移动到C的方法
# def move(n, a, b, c):
#     if n == 1:
#         print('move', a, '-->', c)
#     else:
#         move(n-1, a, c, b)
#         move(1, a, b, c)
#         move(n-1, b, a, c)
# move(4, 'A', 'B', 'C')

# 切片
# # 取一个list或tuple的部分元素
# L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']
# # 取前3个元素
# print(L[0:3]) # 从索引0开始取，直到索引3为止，但不包括索引3。['Michael', 'Sarah', 'Tracy']
# # 如果第一个索引是0，还可以省略：
# print(L[:3]) # ['Michael', 'Sarah', 'Tracy']
# # 同样支持倒数切片
# print(L[-2:]) # ['Bob', 'Jack']

# # 创建一个0-99的数列
# L = list(range(100))
# print(L[:10]) # 前10个数
# print(L[-10:]) # 后10个数
# print(L[:10:2]) # 前10个数，每两个取一个
# print(L[::5]) # 所有数，每5个取一个
# print(L[:]) # 原样复制一个list

# 利用切片操作，实现一个trim()函数，去除字符串首尾的空格
# def trim(s):
#     if len(s) == 0:
#         return ''
#     l=0
#     r=len(s)-1
#     while(s[l]==' '):
#         l=l+1
#         if(l>=r):
#             break
#     while(s[r]==' '):
#         r=r-1
#         if(r<=l):
#             break
#     return s[l:r+1]
# if trim('hello  ') != 'hello':
#     print('测试失败1!')
# elif trim('  hello') != 'hello':
#     print('测试失败2!')
# elif trim('  hello  ') != 'hello':
#     print('测试失败3!')
# elif trim('  hello  world  ') != 'hello  world':
#     print('测试失败4!')
# elif trim('') != '':
#     print('测试失败5!')
# elif trim('    ') != '':
#     print('测试失败6!')
# else:
#     print('测试成功!')

# 迭代
# 如何判断一个对象是可迭代对象呢？方法是通过collections.abc模块的Iterable类型判断：
# from collections.abc import Iterable
# print(isinstance('abc', Iterable)) # True
# print(isinstance([1,2,3], Iterable)) # True
# print(isinstance(123, Iterable)) # False

# 在Python中，迭代是通过for ... in来完成的，不仅可以用在list或tuple上，还可以作用在其他可迭代对象上。
# lis = [5,6,7]
# for item in lis:
#   print(item) # 5 6 7

# forIn对list或tuple获取的是value，对dict迭代的是key
# d = {'a': 1, 'b': 2, 'c': 3}
# for key in d:
#   print(key) # 因为dict的存储不是按照list的方式顺序排列，所以，迭代出的结果顺序很可能不一样。

# dict迭代的是key。如果要迭代value，可以用for value in d.values()，
# 如果要同时迭代key和value，可以用for k, v in d.items()。

# 对list实现类似Java那样的下标循环
# Python内置的enumerate函数可以把一个list变成索引-元素对
# for i, value in enumerate(['A', 'B', 'C']):
#   print(i, value)

# 使用迭代查找一个list中最小和最大值，并返回一个tuple
# def findMinAndMax(L):
#   if(len(L)==0):
#     return (None, None)
#   max=L[0]
#   min=L[0]
#   for v in L:
#     if(v>max):
#       max=v
#     elif(v<min):
#       min=v
#   return (min, max)
# if findMinAndMax([]) != (None, None):
#     print('测试失败!')
# elif findMinAndMax([7]) != (7, 7):
#     print('测试失败!')
# elif findMinAndMax([7, 1]) != (1, 7):
#     print('测试失败!')
# elif findMinAndMax([7, 1, 3, 9, 5]) != (1, 9):
#     print('测试失败!')
# else:
#     print('测试成功!')

# 列表生成式 - 创建list
# # 生成list [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],并筛选出仅偶数的平方
# print([x * x for x in range(1, 11) if x % 2 == 0]) # [4, 16, 36, 64, 100]
# # 把要生成的元素x * x放到前面，后面跟for循环,加上if判断

# 还可以使用两层循环，可以生成全排列
# [m + n for m in 'ABC' for n in 'XYZ'] # ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']

# 列出当前目录下的所有文件和目录名
# import os
# print([d for d in os.listdir('.')]) # ['test1', '__pycache__', 'test.py', 'readme.md', '.venv', 'app.py']

# 列表生成式也可以使用两个变量来生成list
# d = {'x': 'A', 'y': 'B', 'z': 'C' }
# [k + '=' + v for k, v in d.items()] # ['y=B', 'x=A', 'z=C']

# 把一个list中所有的字符串变成小写
# L = ['Hello', 'World', 'IBM', 'Apple']
# [s.lower() for s in L] # ['hello', 'world', 'ibm', 'apple']

# 在一个列表生成式中，
# # for前面的if ... else是表达式，因为for前面的部分是一个表达式，它必须根据x计算出一个结果。
# [x if x % 2 == 0 else -x for x in range(1, 11)]
# # 而for后面的if是过滤条件，不能带else。，否则如何筛选？
# [x for x in range(1, 11) if x % 2 == 0]

# 通过添加if语句保证列表生成式能正确地执行
# L1 = ['Hello', 'World', 18, 'Apple', None]
# L2 = [s.lower() for s in L1 if isinstance(s, str)]
# print(L2)
# if L2 == ['hello', 'world', 'apple']:
#     print('测试通过!')
# else:
#     print('测试失败!')

# 异常 try: xxx except Exception as e: pass
# 运行过程中产生错误-服务器、反爬、网络波动
# import time
# count = 3
# for i in range(count):
#   try:
#     print(1/0)
#     break
#   except Exception as e:
#     print(e)
#     time.sleep(10)

# 生成器
# 创建一个包含100万个元素的列表，不仅占用很大的存储空间，如果我们仅仅需要访问前面几个元素，那后面绝大多数元素占用的空间都白白浪费了。
# 在Python中，这种一边循环一边计算的机制，称为生成器：generator。
# 只要把一个列表生成式的[]改成()，就创建了一个generator：
# L = [x * x for x in range(10)]
# g = (x * x for x in range(10))
# # 创建L和g的区别仅在于最外层的[]和()，L是一个list，而g是一个generator。

# 怎么打印出generator的每一个元素呢？
# generator保存的是算法，每次调用next(g)，就计算出g的下一个元素的值，直到计算到最后一个元素，没有更多的元素时，抛出StopIteration的错误。

# 这种不断调用next(g)实在是太变态了,正确的方法是使用for循环，因为generator也是可迭代对象：
# g = (x * x for x in range(10))
# for n in g:
#   print(n)
# # 通过for循环来迭代它，并且不需要关心StopIteration的错误。

# 如果一个函数定义中包含yield关键字，那么这个函数就不再是一个普通函数，而是一个generator函数，调用一个generator函数将返回一个generator：
# def fib(max):
#     n, a, b = 0, 0, 1
#     while n < max:
#         yield b
#         a, b = b, a + b
#         n = n + 1
#     return 'done'
# f = fib(6)
# print(next(f)) # 1
# print(next(f)) # 1
# print(next(f)) # 2
# print(next(f)) # 3
# print(next(f)) # 5
# print(next(f)) # 8
# print(next(f)) # StopIteration: done

# 我们基本上从来不会用next()来获取下一个返回值，而是直接使用for循环来迭代：
# def fib(max):
#     n, a, b = 0, 0, 1
#     while n < max:
#         yield b
#         a, b = b, a + b
#         n = n + 1
#     return 'done'
# for n in fib(6):
#     print(n)

# 但是用for循环调用generator时，发现拿不到generator的return语句的返回值。如果想要拿到返回值，必须捕获StopIteration错误
# def fib(max):
#     n, a, b = 0, 0, 1
#     while n < max:
#         yield b
#         a, b = b, a + b
#         n = n + 1
#     return 'done'
# g = fib(6)
# while True:
#   try:
#     x = next(g)
#     print('g:', x)
#   except StopIteration as e:
#     print('Generator return value:', e.value)
#     break

# 凡是可作用于for循环的对象都是Iterable类型；
# 凡是可作用于next()函数的对象都是Iterator类型，它们表示一个惰性计算的序列；
# 集合数据类型如list、dict、str等是Iterable但不是Iterator，不过可以通过iter()函数获得一个Iterator对象。
# isinstance(iter('abc'), Iterator) # True

# Python的for循环本质上就是通过不断调用next()函数实现的
# for x in [1, 2, 3, 4, 5]:
#     pass
# # 完全等价于：
# # 首先获得Iterator对象:
# it = iter([1, 2, 3, 4, 5])
# # 循环:
# while True:
#     try:
#         # 获得下一个值:
#         x = next(it)
#     except StopIteration:
#         # 遇到StopIteration就退出循环
#         break


# 函数式编程 - 一种抽象程度很高的编程范式
# 函数-把大段代码拆成函数-把复杂任务分解成简单的任务-面向过程的程序设计的基本单元
# 计算机-CPU执行的是加减乘除的指令代码，以及各种条件判断和跳转指令
# 计算-数学意义上的计算，越是抽象的计算，离计算机硬件越远。
# 纯粹的函数式编程:函数没有变量，没有副作用。只要输入是确定的，输出就是确定的
# 由于Python允许使用变量，因此，Python不是纯函数式编程语言。

# 函数式编程的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数！
# 高阶函数（函数式编程就是指这种高度抽象的编程范式。）
# 接收另一个函数作为参数的函数就称之为高阶函数。
# def add(x, y, f):
#     return f(x) + f(y)

# 高阶函数 map()和reduce()函数。
# # # 把str转换为int的函数：
# from functools import reduce
# DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}
# def str2int(s):
#   def fn(x, y):
#     return x * 10 + y
#   def char2num(s):
#     return DIGITS[s]
#   return reduce(fn, map(char2num, s))

# 把用户输入的不规范的英文名字，变为首字母大写，其他小写的规范名字。
# def normalize(name):
#     r=''
#     for i, value in enumerate(name):
#         if(i==0):
#             r=value.upper()
#         else:
#             r=r+value.lower()
#     return r
# L1 = ['adam', 'LISA', 'barT']
# L2 = list(map(normalize, L1))
# print(L2) # ['Adam', 'Lisa', 'Bart']

# 编写一个prod()函数，可以接受一个list并利用reduce()求积：
# from functools import reduce
# def fn(x, y):
#     return x*y
# def prod(L):
#     return reduce(fn, L)
# print('3 * 5 * 7 * 9 =', prod([3, 5, 7, 9]))
# if prod([3, 5, 7, 9]) == 945:
#     print('测试成功!')
# else:
#     print('测试失败!')

# 把字符串'123.456'转换成浮点数123.456：
# from functools import reduce
# def str2float(s):
#     DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}
#     int, float = s.split('.') # 可以直接赋值给变量
#     def str2num(s):
#         return DIGITS[s]
#     def num2float(a, b):
#         return a * 10 + b
#     part1 = reduce(num2float, map(str2num, int))  # 整数部分
#     part2 = reduce(num2float, map(str2num, float))  # 小数部分
#     return part1 + part2 * (0.1 ** len(float)) # **表示的含义是N次方
# print('str2float(\'123.456\') =', str2float('123.456'))
# if abs(str2float('123.456') - 123.456) < 0.00001:
#     print('测试成功!')
# else:
#     print('测试失败!')

# filter
# 使用了惰性计算，所以只有在取filter()结果的时候，才会真正筛选并每次返回下一个筛出的元素。
# 把一个序列中的空字符串删掉
# def not_empty(s):
#     return s and s.strip()
# list(filter(not_empty, ['A', '', 'B', None, 'C', '  ']))
# # 结果: ['A', 'B', 'C']

# 筛选出回数：
# def is_palindrome(n):
#     if str(n)[:1] == str(n)[-1:] :
#          if len(str(n)) < 3:
#           return True
#          else :
#             return is_palindrome(int(str(n)[1:len(str(n))-1]))
# if list(filter(is_palindrome, range(1, 200))) == [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44, 55, 66, 77, 88, 99, 101, 111, 121, 131, 141, 151, 161, 171, 181, 191]:
#     print('测试成功!')
# else:
#     print('测试失败!')

# sorted 排序算法
# Python内置的sorted()函数就可以对list进行排序：
# sorted([36, 5, -12, 9, -21]) # [-21, -12, 5, 9, 36]

# sorted()函数也是一个高阶函数，它还可以接收一个key函数来实现自定义的排序，例如按绝对值大小排序：
# sorted([36, 5, -12, 9, -21], key=abs) # [5, 9, -12, -21, 36]

# 字符串排序的例子：
# sorted(['bob', 'about', 'Zoo', 'Credit'])
# ['Credit', 'Zoo', 'about', 'bob']
# 按照ASCII的大小比较的，由于'Z' < 'a'，结果，大写字母Z会排在小写字母a的前面。

# 给sorted传入key函数，即可实现忽略大小写的排序：
# sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower)
# ['about', 'bob', 'Credit', 'Zoo']

# 要进行反向排序，不必改动key函数，可以传入第三个参数reverse=True：
# sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower, reverse=True)
# ['Zoo', 'Credit', 'bob', 'about']

# 函数作为返回值
# 不需要立刻求和，而是在后面的代码中，根据需要再计算怎么办？
# def lazy_sum(*args):
#     def sum(): # 函数lazy_sum中又定义了函数sum
#         ax = 0
#         for n in args: # 内部函数sum可以引用外部函数lazy_sum的参数和局部变量
#             ax = ax + n
#         return ax
#     return sum
# 当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”

# 闭包
# 当一个函数返回了一个函数后，其内部的局部变量还被新函数引用
# 返回闭包时牢记一点：返回函数不要引用任何循环变量，或者后续会发生变化的变量。
# def count():
#     fs = []
#     for i in range(1, 4):
#         def f():
#              return i*i
#         fs.append(f)
#     return fs
# f1, f2, f3 = count() 
# f1() f2() f3() # 9 9 9
# 全部都是9！原因就在于返回的函数引用了变量i，但它并非立刻执行。等到3个函数都返回时，它们所引用的变量i已经变成了3，因此最终结果为9。

# 如果一定要引用循环变量怎么办？方法是再创建一个函数，用该函数的参数绑定循环变量当前的值
# def count():
#     def f(j):
#         def g():
#             return j*j
#         return g
#     fs = []
#     for i in range(1, 4):
#         fs.append(f(i)) # f(i)立刻被执行，因此i的当前值被传入f()
#     return fs
# f1, f2, f3 = count()
# f1() f2() f3() # 1 4 9

# 使用闭包时，对外层变量赋值前，需要先使用nonlocal声明该变量不是当前函数的局部变量。
# 使用闭包，就是内层函数引用了外层函数的局部变量。但是，如果对外层变量赋值，由于Python解释器会把x当作函数fn()的局部变量，它会报错：
# def inc():
#     x = 0
#     def fn():
#         # nonlocal x
#         x = x + 1
#         return x
#     return fn

# f = inc()
# print(f()) # 1
# print(f()) # 2
# # UnboundLocalError: cannot access local variable 'x' where it is not associated with a value

# 原因是x作为局部变量并没有初始化，直接计算x+1是不行的。但我们其实是想引用inc()函数内部的x，所以需要在fn()函数内部加一个nonlocal x的声明。加上这个声明后，解释器把fn()的x看作外层函数的局部变量，它已经被初始化了，可以正确计算x+1。
# def createCounter():
#     x = 0
#     def counter():
#         nonlocal x
#         x = x + 1
#         return x
#     return counter
# counterA = createCounter()
# print(counterA(), counterA(), counterA(), counterA(), counterA()) # 1 2 3 4 5
# counterB = createCounter()
# if [counterB(), counterB(), counterB(), counterB()] == [1, 2, 3, 4]:
#     print('测试通过!')
# else:
#     print('测试失败!')

# 匿名函数lambda x: x * x
# 关键字lambda表示匿名函数，冒号前面的x表示函数参数。
# 在Python中，对匿名函数提供了有限支持。匿名函数有个限制，就是只能有一个表达式，不用写return，返回值就是该表达式的结果。
# f = lambda x: x * x
# def build(x, y):
#     return lambda: x * x + y * y

# 装饰器 - 一个返回函数的高阶函数
# 要增强now()函数的功能，
# 比如，在函数调用前后自动打印日志，但又不希望修改now()函数的定义，
# 这种在代码运行期间动态增加功能的方式，称之为“装饰器”（Decorator）。

# @log # 相当于执行了语句 now = log(now)
# def log(func):
#     def wrapper(*args, **kw):
#         print('call %s():' % func.__name__)
#         return func(*args, **kw)
#     return wrapper
# @log # 相当于执行了语句 now = log(now)
# def now():
#     print('2015-3-25')
#
# # 调用now()函数，不仅会运行now()函数本身，还会在运行now()函数前打印一行日志：
# now()
# # call now():
# # 2015-3-25

# 如果decorator本身需要传入参数,比如，要自定义log的文本: @log('execute') # now = log('execute')(now)
# def log(text):
#     def decorator(func):
#         def wrapper(*args, **kw):
#             print('%s %s():' % (text, func.__name__))
#             return func(*args, **kw)
#         return wrapper
#     return decorator
# @log('execute') # now = log('execute')(now)
# def now():
#     print('2015-3-25')
# print(now.__name__) # wrapper
# now()
# # execute now():
# # 2015-3-25

# 函数也是对象，它有__name__等属性，但你去看经过decorator装饰之后的函数，它们的__name__已经从原来的'now'变成了'wrapper'：
# 所以，需要把原始函数的__name__等属性复制到wrapper()函数中，否则，有些依赖函数签名的代码执行就会出错。
# Python内置的functools.wraps就是干这个事的，所以，一个完整的decorator的写法如下：
# # 只需记住在定义wrapper()的前面加上@functools.wraps(func)即可。
# import functools
# def log(text):
#     def decorator(func):
#         @functools.wraps(func)
#         def wrapper(*args, **kw):
#             print('%s %s():' % (text, func.__name__))
#             return func(*args, **kw)
#         return wrapper
#     return decorator

# 偏函数
# int()函数可以把字符串转换为整数，当仅传入字符串时，int()函数默认按十进制转换
# 假设要转换大量的二进制字符串，每次都传入int(x, base=2)非常麻烦

# 可以定义一个int2()的函数，默认把base=2传进去：
# def int2(x, base=2):
#     return int(x, base)
# functools.partial就是帮助我们创建一个偏函数的，不需要我们自己定义int2()，
# functools.partial的作用就是，把一个函数的某些参数给固定住（也就是设置默认值），返回一个新的函数，调用这个新函数会更简单。
# import functools
# int2 = functools.partial(int, base=2)
# # 实际上固定了int()函数的关键字参数base，相当于：
# kw = { 'base': 2 }
# int('10010', **kw)


# 模块
# 一个文件里代码就会越来越长，越来越不容易维护。把很多函数分组，分别放到不同的文件里
# 在Python中，一个.py文件就称之为一个模块（Module）。
# 提高了代码的可维护性。可以被其他地方引用。避免函数名和变量名冲突。
# 如果不同的人编写的模块名相同怎么办？为了避免模块名冲突，Python又引入了按目录来组织模块的方法，称为包（Package）。
# 请注意，每一个包目录下面都会有一个__init__.py的文件，这个文件是必须存在的，否则，Python就把这个目录当成普通目录，而不是一个包。__init__.py可以是空文件，也可以有Python代码，因为__init__.py本身就是一个模块，而它的模块名就是mycompany。
# 引入了包以后，只要顶层的包名不与别人冲突，那所有模块都不会与别人冲突。现在，abc.py模块的名字就变成了mycompany.abc
# 可以有多级目录，组成多级层次的包结构。mycompany.web.www即mycompany文件夹里有web文件夹，web文件夹里有www.py和__init__.py
# 模块名不要和系统模块名冲突，最好先查看系统是否已存在该模块，检查方法是在Python交互环境执行import abc，若成功则说明系统存在此模块。

# 使用模块
#!/usr/bin/env python3 # 第1行注释可以让这个hello.py文件直接在Unix/Linux/Mac上运行
# -*- coding: utf-8 -*- # 第2行注释表示.py文件本身使用标准UTF-8编码；

# ' a test module ' # 表示模块的文档注释，任何模块代码的第一个字符串都被视为模块的文档注释；

# __author__ = 'Michael Liao' # 使用__author__变量把作者写进去
# # 以上就是Python模块的标准文件模板，当然也可以全部删掉不写
# import sys # 导入该模块
# def test():
#     args = sys.argv # 用list存储了命令行的所有参数,至少有一个元素，因为第一个参数永远是该.py文件的名称
#     # 运行python3 hello.py Michael获得的sys.argv就是['hello.py', 'Michael']。
#     if len(args)==1:
#         print('Hello, world!')
#     elif len(args)==2:
#         print('Hello, %s!' % args[1])
#     else:
#         print('Too many arguments!')
# if __name__=='__main__': # 命令行运行hello模块文件时成立
#     test()
# 运行模块1
# $ python3 hello.py # 用命令行运行hello.py
# Hello, world! # 打印Hello, word!
# 运行模块2
# $ python3 # 启动Python交互环境，再导入hello模块：
# >>> import hello # 导入时，没有打印Hello, word!，因为没有执行test()函数。

# 作用域
# # 希望仅仅在模块内部使用。在Python中，是通过_前缀来实现的。
# # 类似_xxx和__xxx这样的函数或变量就是非公开的（private），不应该被直接引用
# # private函数或变量不应该被别人引用，那它们有什么用呢？
# # 是一种非常有用的代码封装和抽象的方法，即：调用greeting()函数不用关心内部的private函数细节
# def _private_1(name):
#     return 'Hello, %s' % name
# def _private_2(name):
#     return 'Hi, %s' % name
# def greeting(name): # 把内部逻辑用private函数隐藏起来了
#     if len(name) > 3:
#         return _private_1(name)
#     else:
#         return _private_2(name)
    
# 安装第三方模块 - 通过包管理工具pip完成
# 注意：Mac或Linux上有可能并存Python 3.x和Python 2.x，因此对应的pip命令是pip3。
# Python 软件包超市：https://pypi.org
# 安装处理图像的工具库：pip install Pillow

# 安装常用模块推荐直接使用Anaconda，这是一个基于Python的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库
# https://www.anaconda.com/download/
# 安装好Anaconda后，重新打开命令行窗口，输入python，可以看到Anaconda的信息。可以尝试直接import numpy等已安装的第三方模块。

# 模块搜索路径
# 默认情况下，Python解释器会搜索当前目录、所有已安装的内置模块和第三方模块，搜索路径存放在sys模块的path变量中
# import sys
# print(sys.path)
# # ['/Users/xuqunhai/Desktop/python', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python312.zip', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12', '/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/lib-dynload', '/Users/xuqunhai/Desktop/python/.venv/lib/python3.12/site-packages']

# 添加自己的搜索目录
# # 是直接修改sys.path(在运行时修改，运行结束后失效。)
# import sys
# sys.path.append('/Users/michael/my_py_scripts')
# 第二种方法是设置环境变量PYTHONPATH
# 设置方式与设置Path环境变量类似。


# 面向对象编程
# OOP把对象作为程序的基本单元，一个对象包含了数据和操作数据的函数。
# 面向过程:程序视为一系列的命令集合，即一组函数的顺序执行。
# 面向对象:程序视为一组对象的集合，执行就是一系列消息在各个对象之间传递。

# # 如果采用面向对象的程序设计思想，我们首选思考的不是程序的执行流程，
# # 而是Student这种数据类型应该被视为一个对象，
# # 这个对象拥有name和score这两个属性（Property）。
# # 如果要打印一个学生的成绩，
# # 首先必须创建出这个学生对应的对象，
# # 然后，给对象发一个print_score消息，让对象自己把自己的数据打印出来。
# class Student(object):
#     def __init__(self, name, score):
#         self.name = name
#         self.score = score
#     def print_score(self):
#         print('%s: %s' % (self.name, self.score))
# # 给对象发消息实际上就是调用对象对应的关联函数
# bart = Student('Bart Simpson', 59)
# bart.print_score()
# 定义的Class——Student，是指学生这个概念，而实例（Instance）则是一个个具体的Student
# 面向对象的抽象程度又比函数要高，因为一个Class既包含数据，又包含操作数据的方法。

# 类和实例
# class Student(object):
# 定义类是通过class关键字
# class后面紧接着是类名，即Student
# 紧接着是(object)，表示该类是从哪个类继承下来的.如果没有合适的继承类，就使用object类，这是所有类最终都会继承的类。
#   def __init__(self, name, score):
#   __init__方法的第一个参数永远是self，表示创建的实例本身.但self不需要传，Python解释器自己会把实例变量传进去：

# 数据封装
# 要定义一个方法，除了第一个参数是self外，其他和普通函数一样。
#   def print_score(self):
# 方法可以直接在实例变量上调用，不需要知道内部实现细节

# 访问限制
# 如果要让内部属性不被外部访问，可以把属性的名称前加上两个下划线__，在Python中，实例的变量名如果以__开头，就变成了一个私有变量（private），只有内部可以访问，外部不能访问，所以，我们把Student类改一改：
# 但是如果外部代码要获取name和score怎么办？可以给Student类增加get_name和get_score这样的方法
# def get_name(self):
#   return self.__name
# 需要注意的是，在Python中，变量名类似__xxx__的，也就是以双下划线开头，并且以双下划线结尾的，是特殊变量，特殊变量是可以直接访问的，不是private变量，所以，不能用__name__、__score__这样的变量名。

# 双下划线开头的实例变量是不是一定不能从外部访问呢？
# 其实也不是。不能直接访问__name是因为Python解释器对外把__name变量改成了_Student__name，所以，仍然可以通过_Student__name来访问__name变量：
# 注意下面的这种错误写法：
# bart = Student('Bart Simpson', 59)
# bart.get_name() # 'Bart Simpson'
# bart.__name = 'New Name' # 设置__name变量！
# bart.__name # 'New Name'
# bart.get_name() # 'Bart Simpson'
# 表面上看，外部代码“成功”地设置了__name变量，但实际上这个__name变量和class内部的__name变量不是一个变量！
# 内部的__name变量已经被Python解释器自动改成了_Student__name，而外部代码给bart新增了一个__name变量。

# 继承和多态
# 继承有什么好处？
# 最大的好处是子类获得了父类的全部功能。
# 定义一个class的时候，可以从某个现有的class继承，
# 新的class称为子类（Subclass），而被继承的class称为基类、父类或超类（Base class、Super class）。
# class Dog(Animal):
# 对于Dog来说，Animal就是它的父类，对于Animal来说，Dog就是它的子类。

# 继承的另一个好处：多态。
# 子类的run()覆盖了父类的run()，在代码运行的时候，总是会调用子类的run()。

# 定义一个class的时候，我们实际上就定义了一种数据类型。
# c = Dog() # c是Dog类型
# isinstance(c, Dog) # True
# isinstance(c, Animal) # True
# # 所以，在继承关系中，如果一个实例的数据类型是某个子类，那它的数据类型也可以被看做是父类。

# 多态真正的威力：调用方只管调用，不管细节
# 对于一个变量，我们只需要知道它是Animal类型，无需确切地知道它的子类型，就可以放心地调用run()方法，
# 而具体调用的run()方法是作用在Animal、Dog、Cat还是Tortoise对象上，由运行时该对象的确切类型决定

# 动态语言的“鸭子类型”(继承不像静态语言那样是必须的)
# 对于静态语言（例如Java）来说，如果需要传入Animal类型，则传入的对象必须是Animal类型或者它的子类
# 对于Python这样的动态语言来说，则不一定需要传入Animal类型。我们只需要保证传入的对象有一个run()方法

# 获取对象信息
# 如何知道这个对象是什么类型、有哪些方法呢？

# 使用type(),它返回对应的Class类型。
# 但如果要判断一个对象是否是函数怎么办？可以使用types模块中定义的常量
# type(abs)==types.BuiltinFunctionType # True
# type(lambda x: x)==types.LambdaType # True
# type((x for x in range(10)))==types.GeneratorType # True

# 对于class的继承关系来说，使用type()就很不方便。我们要判断class的类型，可以使用isinstance()函数。
# isinstance()判断的是一个对象是否是该类型本身，或者位于该类型的父继承链上。
# isinstance(d, Dog) # True
# isinstance(d, Animal) # True
# isinstance 还可以判断一个变量是否是某些类型中的一种
# isinstance([1, 2, 3], (list, tuple)) # True

# 获得一个对象的所有属性和方法
# print(dir('ABC')) # 返回一个包含字符串的list
# 在Python中，如果你调用len()函数试图获取一个对象的长度，实际上，在len()函数内部，它自动去调用该对象的__len__()方法
# len('ABC') 等价 'ABC'.__len__()
# # 自己写的类，如果也想用len(myObj)的话，就自己写一个__len__()方法：
# class MyDog(object):
#   def __len__(self):
#     return 100
# dog = MyDog()
# len(dog) # 100

# 直接操作一个对象的状态：
# hasattr(obj, 'x') # 有属性'x'吗？
# setattr(obj, 'y', 19) # 设置一个属性'y'
# getattr(obj, 'y') # 获取属性'y'
# obj.y # 获取属性'y'
# 如果试图获取不存在的属性，会抛出AttributeError的错误：
# getattr(obj, 'z') # AttributeError: 'MyObject' object has no attribute 'z'
# 可以传入一个default参数，如果属性不存在，就返回默认值：
# getattr(obj, 'z', 404) # 获取属性'z'，如果不存在，返回默认值404

# 实例属性和类属性
# 直接在class中定义属性，这种属性是类属性，归Student类所有：
# class Student(object):
#     name = 'Student'
# 这个属性虽然归类所有，但类的所有实例都可以访问到。
# 相同名称的实例属性将屏蔽掉类属性，但是当你删除实例属性后，再使用相同的名称，访问到的将是类属性。


# 面向对象高级编程 (多重继承、定制类、元类等)
# 创建了一个class的实例后，我们可以给该实例绑定任何属性和方法，这就是动态语言的灵活性。
# 但是，给一个实例绑定的方法，对另一个实例是不起作用的：
# 为了给所有实例都绑定方法，可以给class绑定方法：

# 如果我们想要限制实例的属性怎么办？比如，只允许对Student实例添加name和age属性。
# 定义一个特殊的__slots__变量：
# class Student(object):
#     __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称
# 使用__slots__要注意，__slots__定义的属性仅对当前类实例起作用，对继承的子类是不起作用的，除非在子类中也定义__slots__

# 有没有既能检查参数，又可以用类似属性这样简单的方式来访问类的变量呢？
# Python内置的@property装饰器就是负责把一个方法变成属性调用的：
# # birth是可读写属性，而age就是一个只读属性
# class Student(object):
#     @property
#     def birth(self):
#         return self._birth
#     @birth.setter
#     def birth(self, value):
#         self._birth = value
#     @property
#     def age(self):
#         return 2015 - self._birth

# 要特别注意：属性的方法名不要和实例变量重名。
# class Student(object):
#     # 方法名称和实例变量均为birth:
#     @property
#     def birth(self):
#         return self.birth
# # 调用s.birth时，首先转换为方法调用，
# # 在执行return self.birth时，又视为访问self的属性，
# # 于是又转换为方法调用，造成无限递归，最终导致栈溢出报错RecursionError。

# 多重继承
# 如果需要“混入”额外的功能，通过多重继承就可以实现，这种设计通常称之为MixIn。
# 让某个动物同时拥有好几个MixIn：
# class Dog(Mammal, RunnableMixIn, CarnivorousMixIn):
#     pass
# 优先考虑通过多重继承来组合多个MixIn的功能，而不是设计多层次的复杂的继承关系。
# 比如，编写一个多进程模式的TCP服务，定义如下：
# class MyTCPServer(TCPServer, ForkingMixIn):
#     pass

# 定制类
# 形如__xxx__的变量或者函数名就要注意，这些在Python中是有特殊用途的。可以帮助我们定制类。

# __str__
# 定义一个Student类，打印一个实例。怎么才能打印得好看呢？
# 定义好__str__()方法，返回一个好看的字符串就可以了：
# >>> class Student(object):
# ...     def __init__(self, name):
# ...         self.name = name
# ...     def __str__(self):
# ...         return 'Student object (name: %s)' % self.name
# ...
# >>> print(Student('Michael'))
# Student object (name: Michael)

# 直接敲变量不用print，打印出来的实例还是不好看：
# >>> s = Student('Michael')
# >>> s
# <__main__.Student object at 0x109afb310>
# 因为直接显示变量调用的不是__str__()，而是__repr__()
# 解决办法是再定义一个__repr__()。但是通常__str__()和__repr__()代码都是一样的，所以，有个偷懒的写法：
# class Student(object):
#     def __init__(self, name):
#         self.name = name
#     def __str__(self):
#         return 'Student object (name=%s)' % self.name
#     __repr__ = __str__

# __iter__
# 如果一个类想被用于for ... in循环，类似list或tuple那样，就必须实现一个__iter__()方法，该方法返回一个迭代对象
# Python的for循环就会不断调用该迭代对象的__next__()方法拿到循环的下一个值，直到遇到StopIteration错误时退出循环。

# __getitem__
# 像list那样按照下标取出元素，需要实现__getitem__()方法
# __getitem__()传入的参数可能是一个int，也可能是一个切片对象slice，所以要做判断：
# 这完全归功于动态语言的“鸭子类型”，不需要强制继承某个接口。

# __getattr__
# 当我们调用类的方法或属性时，Python解释器会试图调用__getattr__(self, 'score')来尝试获得属性，如果不存在，就会报错。
# 注意，只有在没有找到属性的情况下，才调用__getattr__，已有的属性，比如name，不会在__getattr__中查找。

# 要让class只响应特定的几个属性，我们就要按照约定，抛出AttributeError的错误：
# class Student(object):
#     def __getattr__(self, attr):
#         if attr=='age':
#             return lambda: 25
#         raise AttributeError('\'Student\' object has no attribute \'%s\'' % attr)

# 利用完全动态的__getattr__，我们可以写出一个链式调用：
# class Chain(object):
#     def __init__(self, path=''):
#         self._path = path
#     def __getattr__(self, path):
#         return Chain('%s/%s' % (self._path, path))
#     def __str__(self):
#         return self._path
#     __repr__ = __str__
# >>> Chain().status.user.timeline.list
# '/status/user/timeline/list'
# 还有些REST API会把参数放到URL中，比如GitHub的API：
# GET /users/:user/repos
# 调用时，需要把:user替换为实际用户名。如果我们能写出这样的链式调用：
# Chain().users('michael').repos

# __call__
# 直接在实例本身上调用
# 任何类，只需要定义一个__call__()方法，就可以直接对实例进行调用。
# class Student(object):
#     def __init__(self, name):
#         self.name = name
#     def __call__(self):
#         print('My name is %s.' % self.name)
# >>> s = Student('Michael')
# >>> s() # self参数不要传入
# My name is Michael.

# 怎么判断一个变量是对象还是函数呢？
# 判断一个对象是否能被调用，能被调用的对象就是一个Callable对象
# >>> callable(max)
# True
# >>> callable([1, 2, 3])
# False


# 使用枚举类
# 定义常量如月份，更好的方法是定义一个class类型，然后，每个常量都是class的一个唯一实例。
# Python提供了Enum类来实现这个功能：
# from enum import Enum
# Month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))
# # 直接使用Month.Jan来引用一个常量
# # 枚举它的所有成员：
# # for name, member in Month.__members__.items():
# #     print(name, '=>', member, ',', member.value) # Jan => Month.Jan , 1 # value属性则是自动赋给成员的int常量，默认从1开始计数。

# 更精确地控制枚举类型，可以从Enum派生出自定义类：
# from enum import Enum, unique
# @unique # 帮助我们检查保证没有重复值。
# class Weekday(Enum):
#     Sun = 0 # Sun的value被设定为0
#     Mon = 1
#     Tue = 2
#     Wed = 3
#     Thu = 4
#     Fri = 5
#     Sat = 6
# # 访问这些枚举类型
# # >>> day1 = Weekday.Mon
# # >>> print(day1)
# # Weekday.Mon
# # >>> print(day1 == Weekday.Mon)
# # True
# # >>> print(day1 == Weekday(1))
# # True
# # >>> for name, member in Weekday.__members__.items():
# # ...     print(name, '=>', member)

# 使用元类
# type()函数既可以返回一个对象的类型，又可以创建出新的类型，
# >>> Hello = type('Hello', (object,), dict(hello=fn)) # 创建Hello class
# 3个参数：
# 1 class的名称；
# 2 继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
# 3 class的方法名称与函数绑定，这里我们把函数fn绑定到方法名hello上。
# 通过type()函数创建的类和直接写class是完全一样的，因为Python解释器遇到class定义时，仅仅是扫描一下class定义的语法，然后调用type()函数创建出class。
# 动态语言本身支持运行期动态创建类，这和静态语言有非常大的不同，要在静态语言运行期创建类，必须构造源代码字符串再调用编译器，或者借助一些工具生成字节码实现，本质上都是动态编译，会非常复杂。

# 控制类的创建行为，还可以使用metaclass。
# metaclass，直译为元类
# 创建出实例：先定义类，然后创建实例。
# 创建出类：先定义metaclass，然后创建类。metaclass允许你创建类或者修改类。
# 给我们自定义的MyList增加一个add方法：
# class MyList(list, metaclass=ListMetaclass):
#     pass
# 传入关键字参数metaclass时，指示Python解释器在创建MyList时，要通过ListMetaclass.__new__()来创建
# class ListMetaclass(type): # metaclass的类名总是以Metaclass结尾
#     def __new__(cls, name, bases, attrs): # 准备创建的类的对象/类的名字/类继承的父类集合/类的方法集合
#         attrs['add'] = lambda self, value: self.append(value)
#         return type.__new__(cls, name, bases, attrs) # # metaclass是类的模板，所以必须从`type`类型派生：
# >>> L = MyList()
# >>> L.add(1)
# >> L
# [1]
# 总会遇到需要通过metaclass修改类定义的。ORM就是一个典型的例子。
# ORM全称“Object Relational Mapping”，即对象-关系映射
# 所有的类都只能动态定义，因为只有使用者才能根据表的结构定义出对应的类来。

# 错误、调试和测试
# 程序编写有问题 - bug是必须修复的
# 用户输入造成的 - 检查用户输入
# 无法在程序运行过程中预测（磁盘满了。网络突然断掉） - 在程序中通常是必须处理的

# 错误处理
# 如果发生了不同类型的错误，应该由不同的except语句块处理。
# try:
#     print('try...')
#     r = 10 / int('2')
#     print('result:', r)
# except ValueError as e:
#     print('ValueError:', e)
# except ZeroDivisionError as e:
#     print('ZeroDivisionError:', e)
# else:
#     print('no error!')
# finally:
#     print('finally...')
# print('END')

# 使用except时需要注意的是，它不但捕获该类型的错误，还把其子类也“一网打尽”
# try:
#     foo()
# except ValueError as e:
#     print('ValueError')
# except UnicodeError as e:
#     print('UnicodeError')
# 第二个except永远也捕获不到UnicodeError，因为UnicodeError是ValueError的子类，如果有，也被第一个except给捕获了。
# Python所有的错误都是从BaseException类派生的，常见的错误类型和继承关系看这里：
# https://docs.python.org/3/library/exceptions.html#exception-hierarchy

# 使用try...except捕获错误还有一个巨大的好处，就是可以跨越多层调用，
# 不需要在每个可能出错的地方去捕获错误，只要在合适的层次去捕获错误就可以了。
# 如果错误没有被捕获，它就会一直往上抛，最后被Python解释器捕获，打印一个错误信息，然后程序退出。
# 出错的时候，一定要分析错误的调用栈信息，才能定位错误的位置。

# 记录错误
# Python内置的logging模块可以非常容易地记录错误信息：
# 通过配置，logging还可以把错误记录到日志文件里，方便事后排查。

# 抛出错误
# 如果要抛出错误，首先根据需要，可以定义一个错误的class，选择好继承关系，然后，用raise语句抛出一个错误的实例：
# # err_raise.py
# class FooError(ValueError):
#     pass
# def foo(s):
#     n = int(s)
#     if n==0:
#         raise FooError('invalid value: %s' % s)
#     return 10 / n
# foo('0')

# # 另一种错误处理的方式：捕获错误目的只是记录一下，便于后续追踪。继续往上抛，让顶层调用者去处理。
# def bar():
#     try:
#         foo('0')
#     except ValueError as e:
#         print('ValueError!')
#         raise # 打印一个ValueError!后，又把错误通过raise语句抛出去了。raise语句如果不带参数，就会把当前错误原样抛出。
# bar()

# # 在except中raise一个Error，还可以把一种类型的错误转化成另一种类型：
# try:
#     10 / 0
# except ZeroDivisionError:
#     raise ValueError('input error!')

# 根据异常信息进行分析，定位出错误源头，并修复：
# from functools import reduce
# def str2num(s):
#     # return int(s) # 错误源头
#     index = str(s).find('.')
#     return int(s) if index == -1 else float(s)
# def calc(exp):
#     ss = exp.split('+')
#     ns = map(str2num, ss)
#     return reduce(lambda acc, x: acc + x, ns)
# def main():
#     r = calc('100 + 200 + 345')
#     print('100 + 200 + 345 =', r)
#     r = calc('99 + 88 + 7.6')
#     print('99 + 88 + 7.6 =', r)
# main()

# 调试
# 第一种方法简单直接粗暴有效，就是用print()把可能有问题的变量打印出来看看
# 用print()最大的坏处是将来还得删掉它，想想程序里到处都是print()，运行结果也会包含很多垃圾信息。

# 第二种方法用断言（assert）
# 如果断言失败，assert语句本身就会抛出AssertionError
# 程序中如果到处充斥着assert，和print()相比也好不到哪去。
# 不过，启动Python解释器时可以用-O参数来关闭assert：关闭后，你可以把所有的assert语句当成pass来看。
# $ python -O err.py # 注意：断言的开关“-O”是英文大写字母O，不是数字0。

# 第3种方式logging不会抛出错误，而且可以输出到文件：
# import logging
# logging.basicConfig(level=logging.INFO)
# ...
# logging.info('n = %d' % n)
# ...
# 允许你指定记录信息的级别，有debug，info，warning，error等几个级别，当我们指定level=INFO时，logging.debug就不起作用了。同理，指定level=WARNING后，debug和info就不起作用了。
# logging的另一个好处是通过简单的配置，一条语句可以同时输出到不同的地方，比如console和文件。

# 第4种方式是启动Python的调试器pdb
# $ python -m pdb err.py
# 让程序以单步方式运行，但实在是太麻烦了，如果有一千行代码，要运行到第999行得敲多少命令啊。
# 另一种调试方法只需要import pdb，然后，在可能出错的地方放一个pdb.set_trace()，就可以设置一个断点,运行到这里会自动暂停
# 程序会自动在pdb.set_trace()暂停并进入pdb调试环境，可以用命令p查看变量，或者用命令c继续运行：

# 如果要比较爽地设置断点、单步执行，就需要一个支持调试功能的IDE。
# Visual Studio Code：https://code.visualstudio.com/，需要安装Python插件。
# PyCharm：http://www.jetbrains.com/pycharm/


# 单元测试
# 单元测试是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作。
# 比如对函数abs():输入正数/负数/0/非数值类型(比如None、[]、{}，期待抛出TypeError。)
# 确保一个程序模块的行为符合我们设计的测试用例。
# 为了编写单元测试，我们需要引入Python自带的unittest模块
# import unittest
# class TestDict(unittest.TestCase): # 编写一个测试类，从unittest.TestCase继承。
#   def test_init(self): # 以test开头的方法就是测试方法，不以test开头的方法不被认为是测试方法，测试的时候不会被执行。
# 最常用的断言就是assertEqual()：self.assertEqual(abs(-1), 1) # 断言函数返回的结果与1相等
# 另一种重要的断言就是期待抛出指定类型的Error: with self.assertRaises(KeyError):
# 运行单元测试
# 最简单的运行方式是在mydict_test.py的最后加上两行代码：
#   if __name__ == '__main__':
#       unittest.main()
# 另一种方法是在命令行通过参数-m unittest直接运行单元测试：
# $ python -m unittest mydict_test
# 这是推荐的做法，因为这样可以一次批量运行很多单元测试
# 可以在单元测试中编写两个特殊的setUp()和tearDown()方法。这两个方法会分别在每调用一个测试方法的前后分别被执行。
# 设想你的测试需要启动一个数据库，这时，就可以在setUp()方法中连接数据库，在tearDown()方法中关闭数据库

# 分数不正常报错写法
# if self.score not in range(101):
#   raise ValueError('invalid score')
# if not isinstance(self.score, int) and not isinstance(self.score, float) or self.score < 0 or self.score > 100:
#   raise ValueError('invalid score %s ,score must be a number between 0 and 100' % self.score)


# doctest非常有用，
# 不但可以用来测试，还可以直接作为示例代码。
# 通过某些文档生成工具，就可以自动把包含doctest的注释提取出来。
# 用户看文档的时候，同时也看到了doctest。


# IO编程
# IO在计算机中指Input/Output，也就是输入和输出。
# 比如，从磁盘读取文件到内存，就只有Input操作，反过来，把数据写到磁盘文件里，就只是一个Output操作。
# 访问新浪首页，浏览器这个程序就需要通过网络IO获取新浪的网页。浏览器和新浪服务器之间至少需要建立两根水管，才可以既能发数据，又能收数据。

# 由于CPU和内存的速度远远高于外设的速度，所以，在IO编程中，就存在速度严重不匹配的问题。
# 第一种是CPU等着，这种模式称为同步IO；
# 另一种方法是CPU不等待，后续代码可以立刻接着执行，这种模式称为异步IO。
# 使用异步IO来编写程序性能会远远高于同步IO，但是异步IO的缺点是编程模型复杂。
# 而通知你的方法也各不相同。如果是服务员跑过来找到你，这是回调模式，如果服务员发短信通知你，你就得不停地检查手机，这是轮询模式。


## 常用内建模块
## datetime
## 获取当前日期和时间
# from datetime import datetime
# now = datetime.now() # 获取当前datetime
# print(now) # 2024-03-12 22:36:20.093727
# print(type(now)) # <class 'datetime.datetime'>

## 获取指定日期和时间
# from datetime import datetime
# dt = datetime(2015, 4, 19, 12, 20) # 用指定日期时间创建datetime
# print(dt) # 2015-04-19 12:20:00

## datetime转换为timestamp
# from datetime import datetime
# dt = datetime(2015, 4, 19, 12, 20) # 用指定日期时间创建datetime
# print(dt.timestamp()) # 1429417200.0 - 注意Python的timestamp是一个浮点数，整数位表示秒。

## timestamp转换为datetime
# from datetime import datetime
# t = 1429417200.0
# print(datetime.fromtimestamp(t)) # 2015-04-19 12:20:00

## timestamp也可以直接被转换到UTC标准时区的时间
# from datetime import datetime
# t = 1429417200.0
# print(datetime.fromtimestamp(t)) # 2015-04-19 12:20:00
# print(datetime.utcfromtimestamp(t)) # UTC时间,2015-04-19 04:20:00

## str转换为datetime
# from datetime import datetime
# cday = datetime.strptime('2015-6-1 18:19:59', '%Y-%m-%d %H:%M:%S')
# print(cday) # 2015-06-01 18:19:59

## datetime转换为str
# from datetime import datetime
# now = datetime.now()
# print(now.strftime('%a, %b %d %H:%M')) # Tue, Mar 12 22:44

## 使用timedelta你可以很容易地算出前几天和后几天的时刻。
# from datetime import datetime, timedelta
# now = datetime.now()
# print(now)                               # 2024-03-12 22:45:04.197968
# print(now + timedelta(hours=10))         # 2024-03-13 08:45:16.457436
# print(now - timedelta(days=1))           # 2024-03-11 22:45:47.770437
# print(now + timedelta(days=2, hours=12)) # 2024-03-15 10:45:47.770437

## 本地时间转换为UTC时间
## 本地时间是指系统设定时区的时间，例如北京时间是UTC+8:00时区的时间，而UTC时间指UTC+0:00时区的时间。
# from datetime import datetime, timedelta, timezone
# tz_utc_8 = timezone(timedelta(hours=8)) # 创建时区UTC+8:00
# now = datetime.now()
# print(now) # 2024-03-12 22:48:09.057177

## 时区转换
## 先通过utcnow()拿到当前的UTC时间，再转换为任意时区的时间

## collections
## namedtuple集合模块
# from collections import namedtuple
# Point = namedtuple('Point', ['x', 'y'])
# p = Point(1, 2)
# print(p.x) # 1
# # 可以验证创建的Point对象是tuple的一种子类：
# print(isinstance(p, Point)) # True
# # 如果要用坐标和半径表示一个圆，也可以用namedtuple定义：
# # namedtuple('名称', [属性list]):
# Circle = namedtuple('Circle', ['x', 'y', 'r'])

## deque
## 高效实现插入和删除操作的双向列表，适合用于队列和栈
## list是线性存储，数据量大的时候，插入和删除效率很低。
# from collections import deque
# q = deque(['a', 'b', 'c'])
# q.append('x')
# q.appendleft('y')
# print(q) # deque(['y', 'a', 'b', 'c', 'x'])
# deque除了实现list的append()和pop()外，还支持appendleft()和popleft()

## defaultdict
## 使用dict时，如果引用的Key不存在，就会抛出KeyError。
## 如果希望key不存在时，返回一个默认值，就可以用defaultdict
# from collections import defaultdict
# dd = defaultdict(lambda: 'N/A') # 注意默认值是调用函数返回的，而函数在创建defaultdict对象时传入。
# print(dd['key2']) # key2不存在，返回默认值'N/A'

## OrderedDict
## 对dict做迭代时，我们无法确定Key的顺序。如果要保持Key的顺序，可以用OrderedDict：
# from collections import OrderedDict
# d = dict([('a', 1), ('b', 2), ('c', 3)])
# print(d) # {'a': 1, 'b': 2, 'c': 3}
# od = OrderedDict([('a', 1), ('b', 2), ('c', 3)])
# print(od) # OrderedDict({'a': 1, 'b': 2, 'c': 3})
# # 注意，OrderedDict的Key会按照插入的顺序排列，不是Key本身排序：
# # OrderedDict可以实现一个FIFO（先进先出）的dict，当容量超出限制时，先删除最早添加的Key

## ChainMap
## 可以把一组dict串起来并组成一个逻辑上的dict。
# 什么时候使用ChainMap最合适？
# 应用程序往往都需要传入参数，参数可以通过命令行传入，可以通过环境变量传入，还可以有默认参数。
# 可以用ChainMap实现参数的优先级查找，即先查命令行参数，如果没有传入，再查环境变量，如果没有，就使用默认参数。

## Counter是一个简单的计数器，例如，统计字符出现的个数：
# from collections import Counter
# c = Counter()
# for ch in 'programming':
#   c[ch] = c[ch] + 1
# print(c) # Counter({'r': 2, 'g': 2, 'm': 2, 'p': 1, 'o': 1, 'a': 1, 'i': 1, 'n': 1})

## argparse
# 简化参数解析，定义好各个参数类型后，它能直接返回有效的参数。

# 字符集和bytes
# 历史
# 1个字节    2个字节
# ascii -> ANSI标准 -> 中国（GB2312 -> GBK -> GB18030）
#                  -> 台湾（BIG5）
# unicode（可变长度-避免空间浪费） - 字母1个字节、欧洲文2个字节、中文3个字节
# （注意gbk里中文2个字节，utf8所有都是3字节）
# s = '中国'
# bs1 = s.encode('utf-8')
# bs2 = s.encode('gbk')
# print(bs1) # b'\xe4\xb8\xad\xe5\x9b\xbd' -> 6
# print(bs2) # b'\xd6\xd0\xb9\xfa' -> 4
# 所以需要知道编码是utf还是gbk后才能正确解码，不能说encode用utf8，decode用gbk

# 内存unicode，硬盘需编码成gbk或utf8

# # 字符串换成字节 - 中文3字节，字母数字1字节，所以转成bytes后字母数字正常显示
# bs = '拉夫666rafer'.encode('utf-8') # b'\xe6\x8b\x89\xe5\xa4\xab666rafer'
# print(bs)
# # 字节还原字符串
# bt= b'\xe6\x8b\x89\xe5\xa4\xab666rafer'
# print(bt.decode('utf-8')) # 拉夫666rafer

# 文件操作
# 写
# f = open('666.txt', mode='w', encoding="utf-8") # a是追加模式，
# f.write('111')
# f.write('222')
# encoding针对的是文字，如果是图片或音视频，拿到的只能是字节，即二进制流，所以mode变为wb，且不需要加encoding
# f = open('1.jpg', mode='wb') # 读取字节就是 rb 模式

# 读
# f = open('666.txt', mode='r', encoding="utf-8")
# print(f.read()) # 一次性读取
# 一行一行读取可用
# for line in f:
#   line = line.strip() # print函数内部会在末尾加换行\n，所以需要去掉
#   print(line)

# 读写完成后都要调用f.close()，可用语法糖 with，好处是不需要手动close关闭
# with open() as f:
#   pass

## Base64是一种最常见的二进制编码方法。(二进制到字符串)
# 打开exe、jpg、pdf这些文件时，我们都会看到一大堆乱码,因为二进制文件包含很多无法显示和打印的字符，
# Base64的原理
# 1.准备一个包含64个字符的数组
# 2.对二进制数据进行处理，每3个字节一组，一共是3x8=24bit，划为4组
# 3.得到4个数字作为索引，然后查表，获得相应的4个字符，就是编码后的字符串
# 所以，Base64编码会把3字节的二进制数据编码为4字节的文本数据，长度增加33%，好处是编码后的文本数据可以在邮件正文、网页等直接显示。
# 如果要编码的二进制数据不是3的倍数，最后会剩下1个或2个字节怎么办？
# Base64用\x00字节在末尾补足后，再在编码的末尾加上1个或2个=号，表示补了多少字节，解码的时候，会自动去掉。
# import base64
# print(base64.b64encode(b'binary\x00string')) # b'YmluYXJ5AHN0cmluZw=='
# print(base64.b64decode(b'YmluYXJ5AHN0cmluZw=='))
# 由于标准的Base64编码后可能出现字符+和/，在URL中就不能直接作为参数，
# 所以又有一种"url safe"的base64编码，其实就是把字符+和/分别变成-和_：
# base64.b64encode(b'i\xb7\x1d\xfb\xef\xff') # b'abcd++//'
# base64.urlsafe_b64encode(b'i\xb7\x1d\xfb\xef\xff') # b'abcd--__'
# Base64是一种通过查表的编码方法，不能用于加密，即使使用自定义的编码表也不行。
# Base64适用于小段内容的编码，比如数字证书签名、Cookie的内容等。
# 由于=字符也可能出现在Base64编码中，但=用在URL、Cookie里面会造成歧义，所以，很多Base64编码后会把=去掉：
# 去掉=后怎么解码呢？因为Base64是把3个字节变为4个字节，所以，Base64编码的长度永远是4的倍数，因此，需要加上=把Base64字符串的长度变为4的倍数，就可以正常解码了。
# import base64
# def safe_base64_decode(s):
#     if len(s) % 4 == 0:
#         return base64.b64decode(s)
#     else:
#         s += '='
#         return safe_base64_decode(s)
# # 测试:
# assert b'abcd' == safe_base64_decode('YWJjZA=='), safe_base64_decode('YWJjZA==')
# assert b'abcd' == safe_base64_decode('YWJjZA'), safe_base64_decode('YWJjZA')
# print('ok')

## struct
# 解决bytes和其他二进制数据类型的转换。
# struct的pack函数把任意数据类型变成bytes：
# unpack把bytes变成相应的数据类型：
# import struct
# print(struct.unpack('>IH', b'\xf0\xf0\xf0\xf0\x80\x80'))
# # 根据>IH的说明，>表示字节顺序是big-endian，也就是网络序，I表示4字节无符号整数。和H：2字节无符号整数。

## 分析Windows的位图文件（.bmp）
# import struct
# s = b'\x42\x4d\x38\x8c\x0a\x00\x00\x00\x00\x00\x36\x00\x00\x00\x28\x00\x00\x00\x80\x02\x00\x00\x68\x01\x00\x00\x01\x00\x18\x00'
# print(struct.unpack('<ccIIIIIIHH', s)) 
# # (b'B', b'M', 691256, 0, 54, 40, 640, 360, 1, 24)
## BMP格式采用小端方式存储数据，文件头的结构按顺序如下：
# 两个字节：'BM'表示Windows位图，'BA'表示OS/2位图； 
# 一个4字节整数：表示位图大小； 
# 一个4字节整数：保留位，始终为0； 
# 一个4字节整数：实际图像的偏移量； 
# 一个4字节整数：Header的字节数； 
# 一个4字节整数：图像宽度； 
# 一个4字节整数：图像高度； 
# 一个2字节整数：始终为1； 
# 一个2字节整数：颜色数。

## 实现检查任意文件是否是位图文件，如果是，打印出图片大小和颜色数。
# def bmp_info(data):
#     # 判断是否为位图文件
#     if data[:2] == b'BM':
#         # 解析位图宽度和高度
#         width, height = struct.unpack('<II', data[18:26])
#         # 解析颜色深度
#         color = struct.unpack('<H', data[28:30])[0]
#         return {
#             'width': width,
#             'height': height,
#             'color': color
#         }
#     else:
#         return None

## hashlib
# 摘要算法就是通过摘要函数f()对任意长度的数据data计算出固定长度的摘要digest，目的是为了发现原始数据是否被人篡改过。
# import hashlib
# md5 = hashlib.md5()
# md5.update('how to use md5 in python hashlib?'.encode('utf-8'))
# print(md5.hexdigest()) # d26a53750bc40b38b65a520292f69306

# 很多用户喜欢用123456，888888，password这些简单的口令，于是，黑客可以事先计算出这些常用口令的MD5值，得到一个反推表
# 这样，无需破解，只需要对比数据库的MD5，黑客就获得了使用常用口令的用户账号。
# 所以，要确保存储的用户口令不是那些已经被计算出来的常用口令的MD5，这一方法通过对原始口令加一个复杂字符串来实现，俗称“加盐”：
# def get_md5(user, pws):
#     return hashlib.md5((user.username + pws + user.salt).encode('utf-8')).hexdigest()

## hmac
# Hmac算法：Keyed-Hashing for Message Authentication。它通过一个标准算法，在计算哈希的过程中，把key混入计算过程中。
# 如果salt是我们自己随机生成的，通常我们计算MD5时采用md5(message + salt)。但实际上，把salt看做一个“口令”，加salt的哈希就是：计算一段message的哈希时，根据不同口令计算出不同的哈希。

## 验证用户口令
# import hmac, random
# def hmac_md5(key, s):
#     return hmac.new(key.encode('utf-8'), s.encode('utf-8'), 'MD5').hexdigest()
# class User(object):
#     def __init__(self, username, password):
#         self.username = username
#         self.key = ''.join([chr(random.randint(48, 122)) for i in range(20)])
#         self.password = hmac_md5(self.key, password)
# db = {
#     'michael': User('michael', '123456'),
#     'bob': User('bob', 'abc999'),
#     'alice': User('alice', 'alice2008')
# }
# def login(username, password):
#     user = db[username]
#     return user.password == hmac_md5(user.key, password)
# # 测试:
# assert login('michael', '123456')
# assert login('bob', 'abc999')
# assert login('alice', 'alice2008')
# assert not login('michael', '1234567')
# assert not login('bob', '123456')
# assert not login('alice', 'Alice2008')
# print('ok')

## itertools
# 用于操作迭代对象的函数

## count()会创建一个无限的迭代器
# import itertools
# natuals = itertools.count(1, 2) # 创建一个奇数序列
# for n in natuals:
#   print(n) # 根本停不下来，只能按Ctrl+C退出。

## cycle()会把传入的一个序列无限重复下去：
# cs = itertools.cycle('ABC') # 注意字符串也是序列的一种

## repeat()负责把一个元素无限重复下去，不过如果提供第二个参数就可以限定重复次数：
# ns = itertools.repeat('A', 3)

## 通过takewhile()等函数根据条件判断来截取出一个有限的序列：
# natuals = itertools.count(1)
# ns = itertools.takewhile(lambda x: x <= 10, natuals)
# list(ns) # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

## chain()可以把一组迭代对象串联起来，形成一个更大的迭代器：
# for c in itertools.chain('ABC', 'XYZ'):
#   print(c) # 迭代效果：'A' 'B' 'C' 'X' 'Y' 'Z'

## groupby()把迭代器中相邻的重复元素挑出来放在一起：（忽略大小写分组）
# for key, group in itertools.groupby('AAABBBCCAAA', lambda c: c.upper()):
#   print(key, list(group))
# # A ['A', 'A', 'A']
# # B ['B', 'B', 'B']
# # C ['C', 'C']
# # A ['A', 'A', 'A']

## contextlib
# 在Python中，读写文件这样的资源要特别注意，必须在使用完毕后正确关闭它们。
# 一个方法是使用try...finally：
# Python的with语句允许我们非常方便地使用资源，而不必担心资源没有关闭
# 实际上，任何对象，只要正确实现了上下文管理，就可以用于with语句。
# 实现上下文管理是通过__enter__和__exit__这两个方法实现的。
# 编写__enter__和__exit__仍然很繁琐，因此Python的标准库contextlib提供了更简单的写法，

## 希望在某段代码执行前后自动执行特定代码
# from contextlib import contextmanager
# @contextmanager
# def tag(name):
#     print("<%s>" % name)
#     yield # yield调用会执行with语句内部的所有语句，因此打印出hello和world；
#     print("</%s>" % name) # 最后执行yield之后的语句，打印出</h1>。
# with tag("h1"):
#     print("hello")
#     print("world")
# # <h1>
# # hello
# # world
# # </h1>
# 如果一个对象没有实现上下文，我们就不能把它用于with语句。这个时候，可以用closing()来把该对象变为上下文对象。


## urllib提供了一系列用于操作URL的功能。
# from urllib import request
# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context
# # 不加上面一句会报错：urllib.error.URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1000)>
# with request.urlopen('https://www.baidu.com/s?ie=utf-8&mod=1&isbd=1&isid=A8C4774F43869550&ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=b&rsv_spt=1&oq=a&rsv_pq=91866f80000b3bb3&rsv_t=22f2Bid%2BS6Bn6uhX94rKNctHHrVLT9byMPW4VR0KAFyQktpfDFU04iVLYM2LvZsVuaaM&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=3&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&rsv_btype=t&inputT=915&rsv_sug4=2234&bs=a&rsv_sid=undefined&_ss=1&clist=&hsug=&f4s=1&csor=1&_cr1=32806') as f:
#     data = f.read()
#     print('Status:', f.status, f.reason) # Status: 200 OK
#     for k, v in f.getheaders():
#         print('%s: %s' % (k, v))
#     print('Data:', data.decode('utf-8'))

## 模拟iPhone 6去请求豆瓣首页
# from urllib import request
# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context
# req = request.Request('http://www.douban.com/')
# req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
# with request.urlopen(req) as f:
#     print('Status:', f.status, f.reason)
#     for k, v in f.getheaders():
#         print('%s: %s' % (k, v))
#     print('Data:', f.read().decode('utf-8'))
#     # 豆瓣会返回适合iPhone的移动版网页：

## 模拟一个微博登录，先读取登录的邮箱和口令，然后按照weibo.cn的登录页的格式以username=xxx&password=xxx的编码传入：
# from urllib import request, parse
# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context
# print('Login to weibo.cn...')
# email = input('Email: ')
# passwd = input('Password: ')
# login_data = parse.urlencode([
#     ('username', email),
#     ('password', passwd),
#     ('entry', 'mweibo'),
#     ('client_id', ''),
#     ('savestate', '1'),
#     ('ec', ''),
#     ('pagerefer', 'https://passport.weibo.cn/signin/welcome?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn%2F')
# ])
# req = request.Request('https://passport.weibo.cn/sso/login')
# req.add_header('Origin', 'https://passport.weibo.cn')
# req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
# req.add_header('Referer', 'https://passport.weibo.cn/signin/login?entry=mweibo&res=wel&wm=3349&r=http%3A%2F%2Fm.weibo.cn%2F')
# with request.urlopen(req, data=login_data.encode('utf-8')) as f:
#     print('Status:', f.status, f.reason)
#     for k, v in f.getheaders():
#         print('%s: %s' % (k, v))
#     print('Data:', f.read().decode('utf-8'))

## 通过一个Proxy去访问网站
# proxy_handler = urllib.request.ProxyHandler({'http': 'http://www.example.com:3128/'})
# proxy_auth_handler = urllib.request.ProxyBasicAuthHandler()
# proxy_auth_handler.add_password('realm', 'host', 'username', 'password')
# opener = urllib.request.build_opener(proxy_handler, proxy_auth_handler)
# with opener.open('http://www.example.com/login.html') as f:
#     pass

## XML
## 如何操作XML。
# 有两种方法：DOM和SAX。
# DOM会把整个XML读入内存，解析为树，因此占用内存大，解析慢，优点是可以任意遍历树的节点。
# SAX是流模式，边读边解析，占用内存小，解析快，缺点是我们需要自己处理事件。
# 正常情况下，优先考虑SAX，因为DOM实在太占内存。

## 使用SAX解析XML
# from xml.parsers.expat import ParserCreate
# class DefaultSaxHandler(object):
#     def start_element(self, name, attrs):
#         print('sax:start_element: %s, attrs: %s' % (name, str(attrs)))
#     def end_element(self, name):
#         print('sax:end_element: %s' % name)
#     def char_data(self, text):
#         print('sax:char_data: %s' % text)
# xml = r'''<?xml version="1.0"?>
# <ol>
#     <li><a href="/python">Python</a></li>
#     <li><a href="/ruby">Ruby</a></li>
# </ol>
# '''
# handler = DefaultSaxHandler()
# parser = ParserCreate()
# parser.StartElementHandler = handler.start_element # 读取<a href="/">时；
# parser.EndElementHandler = handler.end_element # 在读取python时
# parser.CharacterDataHandler = handler.char_data # 在读取</a>时。
# parser.Parse(xml)

## 利用SAX编写程序解析Yahoo的XML格式的天气预报，获取天气预报
# from xml.parsers.expat import ParserCreate
# from urllib import request
# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context
# class DefaultSaxHandler(object):
#     def __init__(self):
#         self.pointer = ''
#         self.city = ''
#         self.forecast = []
#     def start_element(self, name, attrs):
#         self.pointer = name
#         if name == 'cast':
#             self.weather = {
#                 'date': '',
#                 'high': '',
#                 'low': ''
#             }
#     def end_element(self, name):
#         if name == 'cast':
#             self.forecast.append(self.weather)
#         self.pointer = ''
#     def char_data(self, text):
#         if self.pointer == 'province':
#             self.city = text
#         elif self.pointer == 'date':
#             self.weather['date'] = text
#         elif self.pointer == 'daytemp_float':
#             self.weather['high'] = text
#         elif self.pointer == 'nighttemp_float':
#             self.weather['low'] = text
#     def toJSON(self):
#         return {'city': self.city, 'forecast': self.forecast}
# def parseXml(xml_str):
#     print(xml_str)
#     handler = DefaultSaxHandler()
#     parser = ParserCreate()
#     parser.StartElementHandler = handler.start_element
#     parser.EndElementHandler = handler.end_element
#     parser.CharacterDataHandler = handler.char_data
#     parser.Parse(xml_str)
#     return handler.toJSON()
# #ceshi
# KEY = '93b4119759bf12ac714b26f8e52b2c18'
# URL = 'https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=%s&output=xml&extensions=all' % KEY
# with request.urlopen(URL, timeout=4) as f:
#     data = f.read()
# result = parseXml(data.decode('utf-8'))
# print(result)
# assert result['city'] == '北京'
# print('OK!')
# # <?xml version="1.0" encoding="UTF-8"?>
# # <response><status>1</status><count>1</count><info>OK</info><infocode>10000</infocode><forecasts type="list"><forecast><city>东城区</city><adcode>110101</adcode><province>北京</province><reporttime>2024-03-15 00:03:17</reporttime><casts type="list"><cast><date>2024-03-15</date><week>5</week><dayweather>晴</dayweather><nightweather>多云</nightweather><daytemp>22</daytemp><nighttemp>7</nighttemp><daywind>南</daywind><nightwind>南</nightwind><daypower>1-3</daypower><nightpower>1-3</nightpower><daytemp_float>22.0</daytemp_float><nighttemp_float>7.0</nighttemp_float></cast><cast><date>2024-03-16</date><week>6</week><dayweather>晴</dayweather><nightweather>晴</nightweather><daytemp>18</daytemp><nighttemp>7</nighttemp><daywind>北</daywind><nightwind>北</nightwind><daypower>1-3</daypower><nightpower>1-3</nightpower><daytemp_float>18.0</daytemp_float><nighttemp_float>7.0</nighttemp_float></cast><cast><date>2024-03-17</date><week>7</week><dayweather>晴</dayweather><nightweather>晴</nightweather><daytemp>14</daytemp><nighttemp>2</nighttemp><daywind>南</daywind><nightwind>南</nightwind><daypower>1-3</daypower><nightpower>1-3</nightpower><daytemp_float>14.0</daytemp_float><nighttemp_float>2.0</nighttemp_float></cast><cast><date>2024-03-18</date><week>1</week><dayweather>晴</dayweather><nightweather>晴</nightweather><daytemp>15</daytemp><nighttemp>4</nighttemp><daywind>南</daywind><nightwind>南</nightwind><daypower>1-3</daypower><nightpower>1-3</nightpower><daytemp_float>15.0</daytemp_float><nighttemp_float>4.0</nighttemp_float></cast></casts></forecast></forecasts></response>
# # {'city': '北京', 'forecast': [{'date': '2024-03-15', 'high': '22.0', 'low': '7.0'}, {'date': '2024-03-16', 'high': '18.0', 'low': '7.0'}, {'date': '2024-03-17', 'high': '14.0', 'low': '2.0'}, {'date': '2024-03-18', 'high': '15.0', 'low': '4.0'}]}
# # OK!


## HTMLParser
## 解析HTML
# from html.parser import HTMLParser
# from html.entities import name2codepoint
# class MyHTMLParser(HTMLParser):
#     def handle_starttag(self, tag, attrs):
#         print('<%s>' % tag)
#     def handle_endtag(self, tag):
#         print('</%s>' % tag)
#     def handle_startendtag(self, tag, attrs):
#         print('<%s/>' % tag)
#     def handle_data(self, data):
#         print(data)
#     def handle_comment(self, data):
#         print('<!--', data, '-->')
#     def handle_entityref(self, name):
#         print('&%s;' % name)
#     def handle_charref(self, name):
#         print('&#%s;' % name)
# parser = MyHTMLParser()
# parser.feed('''<html>
# <head></head>
# <body>
# <!-- test html parser -->
#     <p>Some <a href=\"#\">html</a> HTML&nbsp;tutorial...<br>END</p>
# </body></html>''')


## Pillow图像处理标准库
## 操作图像

## 图像缩放操作
# from PIL import Image
# # 打开一个jpg图像文件，注意是当前路径:
# im = Image.open('1.jpeg')
# # 获得图像尺寸:
# w, h = im.size
# print('Original image size: %sx%s' % (w, h)) # Original image size: 640x479
# # 缩放到50%:
# im.thumbnail((w//2, h//2))
# print('Resize image to: %sx%s' % (w//2, h//2)) # Resize image to: 320x239
# # 把缩放后的图像用jpeg格式保存:
# im.save('thumbnail.jpg', 'jpeg')
# # 其他功能如切片、旋转、滤镜、输出文字、调色板等一应俱全。

## 模糊效果
# from PIL import Image, ImageFilter
# # 打开一个jpg图像文件，注意是当前路径:
# im = Image.open('1.jpeg')
# # 应用模糊滤镜:
# im2 = im.filter(ImageFilter.BLUR)
# im2.save('blur.jpg', 'jpeg')


## 生成字母验证码图片：
# from PIL import Image, ImageDraw, ImageFont, ImageFilter
# import random
# # 随机字母:
# def rndChar():
#     return chr(random.randint(65, 90))
# # 随机颜色1:
# def rndColor():
#     return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))
# # 随机颜色2:
# def rndColor2():
#     return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))
# # 240 x 60:
# width = 60 * 4
# height = 60
# image = Image.new('RGB', (width, height), (255, 255, 255))
# # 创建Font对象:
# font = ImageFont.truetype('Arial.ttf', 36)
# # 创建Draw对象:
# draw = ImageDraw.Draw(image)
# # 填充每个像素:
# for x in range(width):
#     for y in range(height):
#         draw.point((x, y), fill=rndColor())
# # 输出文字:
# for t in range(4):
#     draw.text((60 * t + 10, 10), rndChar(), font=font, fill=rndColor2())
# # 模糊:
# image = image.filter(ImageFilter.BLUR)
# image.save('code.jpg', 'jpeg')
# # 要详细了解PIL的强大功能，请请参考Pillow官方文档：
# https://pillow.readthedocs.org/


## requests
# import requests
# r = requests.get('https://www.douban.com/') # 豆瓣首页
# print(r.status_code) # 418， 

## r.text/url/encoding/content/json()/headers/.cookies['xxx']

# 发送POST请求
# import requests
# r = requests.post('https://accounts.douban.com/login', data={'form_email': 'abc@example.com', 'form_password': '123456'})
# print(r.status_code) # 418

# 传递JSON数据
# params = {'key': 'value'}
# r = requests.post(url, json=params) # 内部自动序列化为JSON

# 上传文件
# 在读取文件时，注意务必使用'rb'即二进制模式读取，这样获取的bytes长度才是文件的长度。
# upload_files = {'file': open('report.xls', 'rb')}
# r = requests.post(url, files=upload_files)

# 请求中传入Cookie，只需准备一个dict传入cookies参数：
# cs = {'token': '12345', 'status': 'working'}
# r = requests.get(url, cookies=cs)

# 指定超时
# r = requests.get(url, timeout=2.5) # 2.5秒后超时


## chardet - 检测编码
# 处理一些不规范的第三方网页的时候。对于未知编码的bytes，要把它转换成str，需要先“猜测”编码。
## 用chardet检测编码bytes
# import chardet
# print(chardet.detect(b'Hello, world!')) # {'encoding': 'ascii', 'confidence': 1.0, 'language': ''}
# # 检测出的编码是ascii，注意到还有个confidence字段，表示检测的概率是1.0（即100%）。

## 检测GBK编码的中文
# import chardet
# data = '离离原上草，一岁一枯荣'.encode('gbk')
# print(chardet.detect(data))
# # {'encoding': 'GB2312', 'confidence': 0.7407407407407407, 'language': 'Chinese'}
# # 检测的编码是GB2312，注意到GBK是GB2312的超集，两者是同一种编码，检测正确的概率是74%，language字段指出的语言是'Chinese'。

## 对UTF-8编码进行检测
# import chardet
# data = '离离原上草，一岁一枯荣'.encode('utf-8')
# print(chardet.detect(data))
# # {'encoding': 'utf-8', 'confidence': 0.99, 'language': ''}

## 对日文进行检测：
# import chardet
# data = '最新の主要ニュース'.encode('euc-jp')
# print(chardet.detect(data))
# # {'encoding': 'EUC-JP', 'confidence': 0.99, 'language': 'Japanese'}


## psutil - 获取系统信息
# psutil = process and system utilities
## 获取CPU的信息
# import psutil
# print(psutil.cpu_count()) # 4
# print(psutil.cpu_count(logical=False)) # 2,CPU物理核心 # 2说明是双核超线程, 4则是4核非超线程

# 统计CPU的用户／系统／空闲时间：
# print(psutil.cpu_times())
# # scputimes(user=72430.16, nice=0.0, system=43756.35, idle=486185.23)

# 实现类似top命令的CPU使用率，每秒刷新一次，累计10次：
# for x in range(10):
#   print(psutil.cpu_percent(interval=1, percpu=True))

# 获取物理内存和交换内存信息 - 返回的是字节为单位的整数
# print(psutil.virtual_memory())
# # svmem(total=8589934592, available=2292260864, percent=73.3, used=4781486080, free=272117760, active=2022297600, inactive=2012430336, wired=2759188480)
# print(psutil.swap_memory())
# # sswap(total=3221225472, used=2621440000, free=599785472, percent=81.4, sin=107819012096, sout=2729639936)

# 获取磁盘分区、磁盘使用率和磁盘IO信息：
# print(psutil.disk_partitions())
# print(psutil.disk_usage('/'))
# print(psutil.disk_io_counters())

# 获取网络接口和网络连接信息：
# print(psutil.net_io_counters())
# print(psutil.net_if_addrs())
# print(psutil.net_connections())
# 可能会得到一个AccessDenied错误，原因是psutil获取信息也是要走系统接口,需要root权限

# 获取到所有进程ID
# print(psutil.pids())

# 获取指定进程ID
# p = psutil.Process(100)
# print(p)
# # psutil.Process(pid=100, name='endpointsecurity', status='running', started='2024-03-08 15:16:54')
# p.name() # 进程名称
# p.exe() # 进程exe路径
# p.cwd() # 进程工作目录
# p.cmdline() # 进程启动的命令行
# p.ppid() # 父进程ID
# p.parent() # 父进程
# p.children() # 子进程列表
# p.status() # 进程状态
# p.username() # 进程用户名
# p.create_time() # 进程创建时间
# p.terminal() # 进程终端
# p.cpu_times() # 进程使用的CPU时间
# p.memory_info() # 进程使用的内存
# p.open_files() # 进程打开的文件
# p.connections() # 进程相关网络连接
# p.num_threads() # 进程的线程数量
# p.threads() # 所有线程信息
# p.environ() # 进程环境变量
# p.terminate() # 结束进程
# psutil还提供了一个test()函数，可以模拟出ps命令的效果：psutil.test()
# 获取一个root用户的进程需要root权限，启动Python交互环境或者.py文件时，需要sudo权限。


## venv
# 所有第三方的包都会被pip安装到Python3的site-packages目录下。
# 每个应用可能需要各自拥有一套“独立”的Python运行环境。venv就是用来为一个应用创建一套“隔离”的Python运行环境。

## 开发一个新的项目project101，需要一套独立的Python运行环境
# # 第一步，创建目录，这里把venv命名为proj101env，因此目录名为proj101env：
# ~$ mkdir proj101env
# ~$ cd proj101env/
# # 第二步，创建一个独立的Python运行环境：
# proj101env$ python3 -m venv .
# # 查看当前目录，可以发现有几个文件夹和一个pyvenv.cfg文件：
# proj101env$ ls # 里面有python3、pip3等可执行文件，实际上是链接到Python系统目录的软链接。
# # 继续进入bin目录，Linux/Mac用source activate，Windows用activate.bat激活该venv环境：
# proj101env$ cd bin
# bin$ source activate
# (proj101env) bin$
# # 注意到命令提示符变了，有个(proj101env)前缀，表示当前环境是一个名为proj101env的Python环境。
# # 退出当前的proj101env环境，使用deactivate命令：
# (proj101env) bin$ deactivate


## 绘制一个长方形
# ## 需要命令行执行 $ python3 test.py
# # 导入turtle包的所有内容:
# from turtle import *
# # 设置笔刷宽度:
# width(4)
# # 前进:
# forward(200)
# # 右转90度:
# right(90)
# # 笔刷颜色:
# pencolor('red')
# forward(100)
# right(90)
# pencolor('green')
# forward(200)
# right(90)
# pencolor('blue')
# forward(100)
# right(90)
# # 调用done()使得窗口等待被关闭，否则将立刻关闭窗口:
# done()


## 绘制5个五角星
# from turtle import *
# def drawStar(x, y):
#     pu()
#     goto(x, y)
#     pd()
#     # set heading: 0
#     seth(0)
#     for i in range(5):
#         fd(40)
#         rt(144)
# for x in range(0, 250, 50):
#     drawStar(x, 0)
# done()


## 网络编程
# 网络通信是两台计算机上的两个进程之间的通信。
# 在Python程序本身这个进程内，连接别的服务器进程的通信端口进行通信。

## TCP/IP简介
# 计算机为了联网，就必须规定通信协议（同一种语言的人可以交流）
# 因为互联网协议包含了上百种协议标准，但是最重要的两个协议是TCP和IP协议
# 每个计算机的唯一标识就是IP地址，类似123.123.123.123。
# 如果一台计算机同时接入到两个或更多的网络，比如路由器，它就会有两个或多个IP地址，
# 所以，IP地址对应的实际上是计算机的网络接口，通常是网卡。
# IP地址实际上是一个32位整数（称为IPv4），以字符串表示的IP地址如192.168.0.1实际上是把32位整数按8位分组后的数字表示，目的是便于阅读。
# 数据被分割成一小块一小块，然后通过IP包发送出去。路由器就负责决定如何把一个IP包转发出去。
# IPv6地址实际上是一个128位整数，它是目前使用的IPv4的升级版，以字符串表示类似于2001:0db8:85a3:0042:1000:8a2e:0370:7334。
# TCP协议则是建立在IP协议之上的。TCP协议负责在两台计算机之间建立可靠连接，保证数据包按顺序到达。
# TCP协议会通过握手建立连接，然后，对每个IP包编号，确保对方按顺序收到，如果包丢掉了，就自动重发。
# 一个TCP报文除了包含要传输的数据外，还包含源IP地址和目标IP地址，源端口和目标端口。
# 一个TCP报文来了之后，到底是交给浏览器还是QQ，就需要端口号来区分。每个网络程序都向操作系统申请唯一的端口号

## Socket是网络编程的一个抽象概念。
# 用一个Socket表示“打开了一个网络链接”，需要知道目标计算机的IP地址和端口号，再指定协议类型即可。

## 模拟浏览器中访问新浪
# # 创建一个基于TCP连接的Socket
# import socket
# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# # 创建Socket时，AF_INET指定使用IPv4协议，如果要用更先进的IPv6，就指定为AF_INET6。
# # SOCK_STREAM指定使用面向流的TCP协议
# s.connect(('www.sina.com.cn', 80)) # 注意参数是一个tuple，包含地址和端口号。
# s.send(b'GET / HTTP/1.1\r\nHost: www.sina.com.cn\r\nConnection: close\r\n\r\n')
# # 接收新浪服务器返回的数据了
# buffer = []
# while True:
#     # 每次最多接收1k字节:
#     d = s.recv(1024)
#     if d:
#         buffer.append(d)
#     else:
#         break
# s.close()
# data = b''.join(buffer)
# header, html = data.split(b'\r\n\r\n', 1)
# print(header.decode('utf-8'))
# # 把接收的数据写入文件:
# with open('sina.html', 'wb') as f:
#     f.write(html)


## 电子邮件
# 一封电子邮件的旅程就是：
# 发件人 -> MUA -> MTA -> MTA -> 若干个MTA -> MDA <- MUA <- 收件人

# 电子邮件软件被称为MUA：Mail User Agent——邮件用户代理。
# MTA：Mail Transfer Agent——邮件传输代理，就是那些Email服务提供商，比如网易、新浪等等。
# Email首先被投递到网易提供的MTA，再由网易的MTA发到对方服务商
# 新浪的MTA会把Email投递到邮件的最终目的地MDA：Mail Delivery Agent——邮件投递代理。
# 发邮件时，MUA和MTA使用的协议就是SMTP：Simple Mail Transfer Protocol，后面的MTA到另一个MTA也是用SMTP协议。
# 收邮件时，MUA和MDA使用的协议有两种：
    # POP：Post Office Protocol，目前版本是3，俗称POP3；
    # IMAP：Internet Message Access Protocol，目前版本是4，优点是不但能取邮件，还可以直接操作MDA上存储的邮件，比如从收件箱移到垃圾箱，等等。
# # auzpgepatyhhbejd

## 发送邮件
# import smtplib
# import email.utils
# from email.mime.application import MIMEApplication
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
# from email.header import Header
# def send_email(filename):
#     sender = '543416624@qq.com'  # 发送邮箱
#     receivers = ['raferxu@163.com']  # 接收邮箱
#     auth_code = "auzpgepatyhhbejd"  # 授权码
#     message = MIMEMultipart()
#     # mtplib.SMTPDataError: (550, b'The "From" header is missing or invalid. 
#     # Please follow RFC5322, RFC2047, RFC822 standard protocol. https://service.mail.qq.com/detail/124/995.')
#     message['From'] = email.utils.formataddr(('发送者', sender))  # 发送者
#     message['To'] = email.utils.formataddr(('收件人', receivers[0]))  # 接收者
#     message['Subject'] = Header(filename, 'utf-8')
#     content = MIMEText(filename)
#     message.attach(content)
#     # 附件
#     excel = MIMEApplication(open(filename, 'rb').read())  # 打开Excel,读取Excel文件
#     excel["Content-Type"] = 'application/octet-stream'  # 设置内容类型
#     excel.add_header('Content-Disposition', 'attachment', filename=filename)
#     message.attach(excel)
#     try:
#         server = smtplib.SMTP_SSL('smtp.qq.com', 465)
#         server.login(sender, auth_code)
#         server.sendmail(sender, receivers, message.as_string())
#         server.set_debuglevel(True)
#         print("邮件发送成功")
#         server.close()
#     except smtplib.SMTPException:
#         print("Error: 无法发送邮件")
# send_email('./sheetjs.xlsx')
# # 协议  服务器         SSL   非 SSL
# # SMTP smtp.163.com   465   25
# # IMAP imap.163.com   993   143
# # POP3 pop.163.com    995   110
# # -------------------------------
# # SMTP smtp.qq.com    465/587
# # IMAP imap.qq.com    993
# # POP3 pop.qq.com     995
# # -------------------------------
# # SMTP smtp.gmail.com 465(SSL)/587(TLS/STARTTLS)
# # IMAP imap.gmail.com 993
# # POP3 pop.gmail.com  995
# # -------------------------------
# # 163/qq: password 为授权码
# # gmail: password 为邮箱密码


## POP3收取邮件
# https://www.liaoxuefeng.com/wiki/1016959663602400/1017800447489504
# 收取邮件分两步：
# 第一步：用poplib把邮件的原始文本下载到本地；
# 第二部：用email解析原始文本，还原为邮件对象。


## 访问数据库
# 程序运行的时候，数据都是在内存中的。当程序终止的时候，通常都需要将数据保存到磁盘上
## 关系数据库
# 付费的商用数据库：Oracle/SQL Server/DB2
# 免费的开源数据库：MySQL/PostgreSQL/sqlite

# 使用SQLite
# SQLite是一种嵌入式数据库，它的数据库就是一个文件。
# Python就内置了SQLite

## 创建user表插入一条记录:
# import sqlite3
# conn = sqlite3.connect('test.db')
# cursor = conn.cursor()
# cursor.execute('create table user (id varchar(20) primary key, name varchar(20))')
# cursor.execute('insert into user (id, name) values (\'1\', \'Michael\')')
# cursor.rowcount
# conn.commit()
# cursor.close()
# conn.close()

## 查询记录：
# import sqlite3 # 导入数据库对应的驱动
# conn = sqlite3.connect('test.db')
# cursor = conn.cursor()
# cursor.execute('select * from user where id=?', ('1',))
# # 如果SQL语句带有参数,有几个?占位符就必须对应几个参数
# # cursor.execute('select * from user where name=? and pwd=?', ('abc', 'password'))
# values = cursor.fetchall() # 通过fetchall()可以拿到结果集。结果集是一个list，每个元素都是一个tuple，对应一行记录。
# print(values) # [('1', 'Michael')]
# cursor.close() # 否则，资源就会泄露。
# conn.close()
# # 如何才能确保出错的情况下也关闭掉Connection对象和Cursor对象呢？请回忆try:...except:...finally:...的用法


## Web开发
# 软件都是运行在大型机上-软件开始主要运行在桌面上(CS架构)-BS架构(CS架构需要每个客户端逐个升级桌面App)
# 客户端只需要浏览器，应用程序的逻辑和数据都存储在服务器端。浏览器只需要请求服务器


## HTTP协议简介
# 浏览器和服务器之间的传输协议是HTTP


## 使用Web框架
# 其实一个Web App，就是写一个WSGI的处理函数，针对每个HTTP请求进行响应。
# 需要在WSGI接口之上能进一步抽象，让我们专注于用一个函数处理一个URL，至于URL到函数的映射，就交给Web框架来做。
# 常见的Python Web框架还有：
# Flask
# Django：全能型Web框架；
# web.py：一个小巧的Web框架；


## 选择Web框架——Flask来处理请求
# 通过Python的装饰器在内部自动地把URL和函数给关联起来
# from flask import Flask
# from flask import request
# app = Flask(__name__)
# @app.route('/', methods=['GET', 'POST']) # 首页，返回Home；
# def home():
#     return '<h1>Home</h1>'
# @app.route('/signin', methods=['GET']) # 登录页，显示登录表单；
# def signin_form():
#     return '''<form action="/signin" method="post">
#               <p><input name="username"></p>
#               <p><input name="password" type="password"></p>
#               <p><button type="submit">Sign In</button></p>
#               </form>'''
# @app.route('/signin', methods=['POST']) # 处理登录表单，显示登录结果。
# def signin():
#     # 需要从request对象读取表单内容：
#     if request.form['username']=='admin' and request.form['password']=='password':
#         return '<h3>Hello, admin!</h3>'
#     return '<h3>Bad username or password.</h3>'
# if __name__ == '__main__':
#     app.run()


## Web App不仅仅是处理逻辑，展示给用户的页面也非常重要。
# 由于在Python代码里拼字符串是不现实的，所以，模板技术出现了。
## 使用模版
# 预先准备一个HTML文档，这个HTML文档不是普通的HTML，而是嵌入了一些变量和指令，然后，根据我们传入的数据，替换后，得到最终的HTML，发送给用户：
# 这就是传说中的MVC：Model-View-Controller，中文名“模型-视图-控制器”。

# Flask通过render_template()函数来实现模板的渲染。
# Flask默认支持的模板是jinja2，所以我们先直接安装jinja2：
# $ pip install jinja2
# 最后，一定要把模板放到正确的templates目录下，templates和app.py在同级目录下：

# 除了Jinja2，常见的模板还有：
# Mako：用<% ... %>和${xxx}的一个模板；
# Cheetah：也是用<% ... %>和${xxx}的一个模板；
# Django：Django是一站式框架，内置一个用{% ... %}和{{ xxx }}的模板。


## 异步IO
# CPU的速度远远快于磁盘、网络等IO。
# 然而，一旦遇到IO操作，如读写文件、发送网络数据时，就需要等待IO操作完成，当前线程被挂起，而其他需要CPU执行的代码就无法被当前线程执行了。
# 多线程和多进程的模型虽然解决了并发问题，但是系统不能无上限地增加线程。
# 一旦线程数量过多，CPU的时间就花在线程切换上了，真正运行代码的时间就少了，结果导致性能严重下降。
# 异步IO: 当代码需要执行一个耗时的IO操作时，它只发出IO指令，并不等待IO结果，然后就去执行其他代码了。
# 当IO操作完成后，将收到一条“IO完成”的消息，处理该消息时就可以直接获取IO操作结果。
# 异步IO模型需要一个消息循环，在消息循环中，主线程不断地重复“读取消息-处理消息”
# 桌面应用程序中了:一个GUI程序的主线程就负责不停地读取消息并处理消息。所有的键盘、鼠标等消息都被发送到GUI程序的消息队列中，然后由GUI程序的主线程处理。
# 由于GUI线程处理键盘、鼠标等消息的速度非常快，所以用户感觉不到延迟。


## 协程
# 协程看上去也是子程序，但执行过程中，在子程序内部可中断，然后转而执行别的子程序，在适当的时候再返回来接着执行。
## 协程有何优势？
# 协程极高的执行效率。没有线程切换的开销，和多线程比，线程数量越多，协程的性能优势就越明显。
# 不需要多线程的锁机制，因为只有一个线程，也不存在同时写变量冲突
## 因为协程是一个线程执行，那怎么利用多核CPU呢？
# 最简单的方法是多进程+协程
# Python对协程的支持是通过generator实现的。

## asyncio提供了完善的异步IO支持；
# 异步操作需要在coroutine中通过yield from完成；
# 多个coroutine可以封装成一组Task然后并发执行。

## 从Python 3.5开始引入了新的语法async和await，可以让coroutine的代码更简洁易读。
# async和await是针对coroutine的新语法，要使用新的语法，只需要做两步简单的替换：
# 把@asyncio.coroutine替换为async；
# 把yield from替换为await。
# @asyncio.coroutine
# def hello():
#     print("Hello world!")
#     r = yield from asyncio.sleep(1)
#     print("Hello again!")
# 用新语法重新编写如下：
# async def hello():
#     print("Hello world!")
#     r = await asyncio.sleep(1)
#     print("Hello again!")


## asyncio实现了TCP、UDP、SSL等协议，aiohttp则是基于asyncio实现的HTTP框架。
# 安装aiohttp：
# pip install aiohttp

# 编写一个HTTP服务器，分别处理以下URL：
# / - 首页返回b'<h1>Index</h1>'；
# /hello/{name} - 根据URL参数返回文本hello, %s!。
# import asyncio
# from aiohttp import web
# async def index(request):
#     await asyncio.sleep(0.5)
#     return web.Response(body=b'<h1>Index</h1>')
# async def hello(request):
#     await asyncio.sleep(0.5)
#     text = '<h1>hello, %s!</h1>' % request.match_info['name']
#     return web.Response(body=text.encode('utf-8'))
# async def init(loop): # 初始化函数init()也是一个coroutine
#     app = web.Application(loop=loop)
#     app.router.add_route('GET', '/', index)
#     app.router.add_route('GET', '/hello/{name}', hello)
#     # loop.create_server()则利用asyncio创建TCP服务。
#     srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8000)
#     print('Server started at http://127.0.0.1:8000...')
#     return srv
# loop = asyncio.get_event_loop() # 获取事件循环对象，管理异步操作的执行和调度
# loop.run_until_complete(init(loop)) # 执行一个异步任务，直到它完成。
# loop.run_forever() # 保持程序持续运行来处理请求


## 使用MicroPython
# MicroPython是Python的一个精简版本，它是为了运行在单片机这样的性能有限的微控制器上，最小体积仅256K，运行时仅需16K内存。
# 裁剪了大部分标准库，仅保留部分模块如math、sys的部分函数和类。此外，很多标准模块如json、re等在MicroPython中变成了以u开头的ujson、ure，表示针对MicroPython开发的标准库。

# 正则
# import re

# search 只匹配一次，
# print(re.search("1[3-9][0-9]{9}", "15111111111")) # <re.Match object; span=(0, 11), match='15111111111'>
# print(re.search("1[3-9][0-9]{9}", "tel15111111111")) # <re.Match object; span=(3, 14), match='15111111111'>
# print(re.search("^1[3-9][0-9]{9}$", "tel15111111111")) # None
# print(re.search("^1[3-9][0-9]{9}$", "15111111111")) # <re.Match object; span=(0, 11), match='15111111111'>

# match 只匹配一次，必须从第一位开始，类似search("^")
# print(re.match("1[3-9][0-9]{9}", "15111111111")) # <re.Match object; span=(0, 11), match='15111111111'>
# print(re.match("1[3-9][0-9]{9}", "tel15111111111")) # None
# print(re.match("1[3-9][0-9]{9}", "15111111111tel")) # <re.Match object; span=(0, 11), match='15111111111'>
# print(re.match("1[3-9][0-9]{9}", "15111111111tel").group()) # 15111111111

# findall
# str = "<b>bold</b><b>boldbold</b><b>boldboldbold</b>"
# print(re.search('<b>.*</b>', str).group()) # <b>bold</b><b>boldbold</b><b>boldboldbold</b> - 贪婪匹配
# print(re.search('<b>.*?</b>', str).group()) # <b>bold</b>
# print(re.search('<b>.*?</b>', str).groups()) # ()
# print(re.search('<b>(.*?)</b>', str).groups()) # ('bold',) - 有多个括号时，groups可单独获取组
# print(re.findall('<b>.*?</b>', str)) # ['<b>bold</b>', '<b>boldbold</b>', '<b>boldboldbold</b>']
# print(re.findall('<b>.*</b>', str)) # ['<b>bold</b><b>boldbold</b><b>boldboldbold</b>']

# 第三参数取值：re.I 忽略大小写 / re.M 多行匹配 / re.S 使点匹配包括换行符
# str = """
# <a href="http://www.baidu.com">baidu1</a>
# <A href="http://www.baidu.com">baidu2</A>
# <a href="http://www.baidu.com">bai
# du3</a>
# """
# print(re.findall('(<a href="(.*?)">(.*?)</a>)', str))
# # [('<a href="http://www.baidu.com">baidu1</a>', 'http://www.baidu.com', 'baidu1')]
# # print(re.findall('(<a href="(.*?)">(.*?)</a>)', str, re.I))
# # [('<a href="http://www.baidu.com">baidu1</a>', 'http://www.baidu.com', 'baidu1'), ('<A href="http://www.baidu.com">baidu2</A>', 'http://www.baidu.com', 'baidu2')]
# print(re.findall('(<a href="(.*?)">(.*?)</a>)', str, re.S))
# # [('<a href="http://www.baidu.com">baidu1</a>', 'http://www.baidu.com', 'baidu1'), ('<a href="http://www.baidu.com">bai\ndu3</a>', 'http://www.baidu.com', 'bai\ndu3')]

# # finditer
# obj = re.finditer("[a-z]", "abcdefg")
# for i in obj:
#   print(i.group())

# # split
# str = "a1b2c3d5e"
# print(re.split('\d', str)) # ['a', 'b', 'c', 'd', 'e']
# print(re.split("\d", str, maxsplit=2)) # ['a', 'b', 'c3d5e']
# str2 = "a\rb\tc\nd\r\ne"
# print(re.split('\s', str2)) # ['a', 'b', 'c', 'd', '', 'e']

# # re.M对^$影响，但对\A-\Z没影响
# str = "abc\nacd"
# print(re.findall("^a", str)) # ['a']
# print(re.findall("^a", str, re.M)) # ['a', 'a']
# print(re.findall("\Aa", str)) # ['a'] - \A只匹配整个字符串开头,\Z只匹配整个字符串行尾
# print(re.findall("\Aa", str, re.M)) # ['a']

# # 分组起名称-当有多个子存储时，别名很方便
# str = "abcd1"
# print(re.search("(\d+)", str).group()) # 1
# print(re.search("(\d+)", str).group(0)) # 1
# print(re.search("(?P<rx>\d+)", str).group("rx")) # 1 - 别名rx，?P<alias>

# # 编译正则 - 便于多次使用
# str = "<b>bold</b><b>boldbold</b><b>boldboldbold</b>"
# print(re.search('<b>.*?</b>', str).group()) # <b>bold</b>
# pattern = re.compile('<b>.*?</b>')
# print(pattern.search(str).group()) # <b>bold</b>

# # 正则demo
# f = open('./xxx.html', 'rb')
# data = f.read().decode('utf-8')
# f.close()
# pattern = re.compile('<img src="https://img\d\.doubanio.com/mpic/\w+\.jpg"/>')
# with open('./img.html', 'w') as f:
#   f.writelines(pattern.findall(data))


## web demo
# 注意爬虫网页时，浏览器elements面板显示的可能和网页源代码不一致，比如table没写tbody，但是elements面板可能有，因为为了确保网页在不同的浏览器中能够尽可能一致地被解析和显示，


# beautifulsoup4 从网页抓取数据
# BeautifulSoup(markup, "html.parser") # html.parser是默认内置解析器，更推荐解析器lxml (pip3 install beautifulsoup4 lxml)
# from bs4 import BeautifulSoup
# with open('./baiduyunpan.html', 'rb') as f:
#     html_doc = f.read().decode('utf-8')
# soup = BeautifulSoup(html_doc, 'lxml')

# from bs4 import BeautifulSoup
# soup = BeautifulSoup(open('./baiduyunpan.html', 'r', encoding='UTF-8'), 'lxml')

# print(type(soup)) # <class 'bs4.BeautifulSoup'>
# print(soup.prettify()) # html美化

# print(soup.link)
# print(soup.link.attrs.href) # AttributeError: 'dict' object has no attribute 'href'
# print(soup.link.attrs["href"]) # https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico

# print(soup.title) # <title>百度网盘 - 视频播放</title>
# print(soup.title.string) # 百度网盘 - 视频播放
# print(soup.title.text) # 百度网盘 - 视频播放
# print(soup.title.get_text()) # 百度网盘 - 视频播放

# bs4.find - 只匹配一条
# print(soup.find('p', attrs={"id": "vjs_video_596_component_836_description"}))
# print(soup.find('p', id="vjs_video_596_component_836_description"))
# print(soup.find('div', class="vp-personal-video-container aichat-width")) # SyntaxError: invalid syntax
# print(soup.find('div', class_="vp-personal-video-container aichat-width")) # class需要特殊处理
# print(soup.find('div', class_="vp-img-container").img.attrs)

# string/text/get_text/stripped_strings区别
# print(soup.find('div', attrs={"class": "vp-dialog__footer"}).string) # None
# print(soup.find('div', class_="vp-dialog__footer").string) # None
# print(soup.find('div', class_="vp-dialog__footer").text) # 取消确认 (紧接着一空行)
# print(repr(soup.find('div', class_="vp-dialog__footer").text)) # '取消确认\n'
# print(soup.find('div', class_="vp-dialog__footer").get_text()) # 取消确认 (紧接着一空行)
# print(soup.find('div', class_="vp-dialog__footer").strings) # <generator object Tag._all_strings at 0x10eb8bd30>
# print(list(soup.find('div', class_="vp-dialog__footer").strings)) # ['取消', '确认', '\n']
# print(list(soup.find('div', class_="vp-dialog__footer").stripped_strings)) # ['取消', '确认'] - 会过滤掉空白文本
# print(soup.find('div', class_="vp-dialog__footer").contents)
# # [<button class="vp-btn week is-round" type="button"><!-- --><span>取消</span></button>, <button class="vp-btn primary is-round vp-dialog__footer-right-btn" type="button"><!-- --><span>确认</span></button>, '\n']

# 匹配所有 find_all，找不到返回空列表（find找不到返回None）
# print(soup.find_all('img')[0:2]) # 获取前两张图片
# print(soup.find_all('img', limit=2))
# 获取a和img标签
# print(soup.find_all(['img', 'a']))
# print(soup.find_all(id=True)) # 有id的节点
# 同时有class和id
# print(soup.find_all('b', class_="story", id="x"))
# print(soup.find_all('b', attrs={"class": "story", "id": "x"}))
# print(soup.find_all('p')[-1].string)

# list = soup.find_all('li')
# for li in list:
#   title = li.a.string
#   print(li.find('span', class_="color-lightgroy").string)
#   print(li.select('.hose-name>a')[0].text)

# select选择器
# print(soup.select('.vp-dialog__footer'))
# print(soup.select("a[href='xxx']"))

# xpath解析
# /从根节点选取，绝对路径
# //不考虑位置，匹配选择。选取所有li元素 //li
# ./基于当前节点再次进行选取。选择当前对象里第一个div节点 节点对象.xpath('./div')
# @选取属性。选取名为hre的所有属性//@href

# pip install lxml -i pip源
# from lxml import etree

# f = open('./baiduyunpan.html', 'r', encoding='UTF-8')
# content = f.read()
# f.close()
# html_tree=etree.HTML(content) # 适合本地和网络html，所以推荐使用
# print(html_tree) # <Element html at 0x102b9f480>
# 下面parse方法只适合本地html文件，所以推荐上面HTML()
# parser=etree.HTMLParser(encoding="utf-8")
# tree=etree.parse('./baiduyunpan.html', parser=parser)

# tree = etree.HTML(open('./xx.html', 'r', encoding='UTF-8').read())
# res = tree.xpath('/html/body/div/div[1]/div/a/text()') # 获取第一个，xpath从1开始
# # re = tree.xpath('/html/body/div/div/div/a)
# # res = res[0].xpath('./text()')
# for e in res:
#     print(etree.tostring(e,encoding='UTF-8').decode('UTF-8'))

# res = tree.xpath('//ul[@class="xxx"]/li//img/@src')
# 注意，res[0].xpath('//text()')和tree.xpath('//text()')等价
# 也就是//在最前面会忽略.xpath前面，而如果在中间则有效

# 指定第几个
# # 倒数第二个li
# res = tree.xpath('//ul[@class="xxx"]/li[last()-1]')
# # 前两个
# res = tree.xpath('//ul[@class="xxx"]/li[position()<3]')

# @attr属性
# # 获取所有src属性
# res = tree.xpath('//@src')
# # 获取带有src的img
# res = tree.xpath('//img[@src]')
# # 获取img的src
# res = tree.xpath('//img/@src')

# 判断
# res = tree.xpath('//a[@title="xxx"]')
# res = tree.xpath('//a[@price<="10"]')

# 通配符使用
# # 获取所有具有price属性的标签
# res = tree.xpath('//*[@price]')

# 或与
# res = tree.xpath('//a[@title="xxx"] | //a[@price<="10"]')
# res = tree.xpath('//a[@title="xxx"] and //a[@price<="10"]')

# 包含关系
# # div的class属性包含div的节点内容
# res = tree.xpath('//div[contains(@class, "div1")]//text()')
# # div的calss属性以div开始的节点内容
# res = tree.xpath('//div[starts-with(@class, "div")]//text()')


# 案例
# # 大学排名
# from lxml import etree
# tree = etree.HTML(open('./xxx.html', 'r', encoding='UTF-8').read())
# res = tree.xpath('//table[@class="xxx x"]//tr')
# for tr in res:
#   tdText = tr.xpath('./td//text()')

# # 匹配天气
# from lxml import etree
# tree = etree.HTML(open('./xxx.html', 'r', encoding='UTF-8').read())
# res = tree.xpath('//table')
# for t in res:
#   tr = t.xpath('./tr')[2:] # 去除头两个标题行
#   for r in tr:
#     print(r.xpath('./td//text()'))

# urllib模块
# import urllib.request
# url = 'http://www.baidu.com' # https报错：certificate verify failed: unable to get local issuer certificate
# res = urllib.request.urlopen(url)
# print(res) # <http.client.HTTPResponse object at 0x102aab3a0>
# print(type(res)) # <class 'http.client.HTTPResponse'>
# print(res.getcode()) # 200
# print(res.geturl()) # http://www.baidu.com
# print(res.getheaders()) # [('Content-Length', '405863'), 
# print(res.read().decode('utf-8'))


# 图片下载 - 会自动分片下载
# urllib.request.urlretrieve(remoteImgUrl, filename="local.png")

# # 中文转码
# url = 'https://www.baidu.com/s?wd=%E8%A9%B9%E5%A7%86%E6%96%AF'
# print(urllib.request.unquote(url)) # https://www.baidu.com/s?wd=詹姆斯
# print(urllib.request.quote('詹姆斯')) # %E8%A9%B9%E5%A7%86%E6%96%AF

# 模拟浏览器
# url = 'http://www.baidu.com/s?'
# headers = {
#   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
# }
# kw = {
#   'wd': '詹姆斯'
# }
# new_url = url + urllib.parse.urlencode(kw)
# # print(new_url)
# request = urllib.request.Request(url=new_url, headers=headers)
# res = urllib.request.urlopen(request)
# with open('zms.html', 'w') as f:
#   f.write(res.read().decode('UTF-8'))

# 模拟POST请求
# import json
# headers = {
#   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
# }
# import ssl
# # 创建一个未验证的SSL上下文来禁用证书验证：
# # 禁用证书验证应该只用于测试目的或当你完全信任请求的服务时。在生产环境中，应该尽可能地解决证书问题，确保使用安全的HTTPS连接。
# context = ssl._create_unverified_context()
# url = 'https://fanyi.baidu.com/langdetect'
# form_data = {
#   'query': '勒布朗'
# }
# data = urllib.parse.urlencode(form_data).encode('UTF-8')
# request = urllib.request.Request(url=url, data=data, headers=headers)
# res = urllib.request.urlopen(request, context=context)
# print(res.getcode()) # 200
# print(json.loads(res.read().decode('UTF-8'))) # {'error': 0, 'msg': 'success', 'lan': 'zh'}

# 安装证书
# pip3 install certifi
# 更新或安装certifi（所有平台）
# pip3 install --upgrade certifi
# 查看CA证书路径
# import certifi
# cert_path = certifi.where()
# print(cert_path) # /Users/xuqunhai/Desktop/python/.venv/lib/python3.12/site-packages/certifi/cacert.pem

# 查看requests库的配置来找到证书的路径
# import requests
# print(requests.certs.where()) # /Users/xuqunhai/Desktop/python/.venv/lib/python3.12/site-packages/certifi/cacert.pem

# response常用属性
# print(res.text) # 类型是str，修改编码方式：response.encoding="UTF-8"
# print(res.content) # 类型是bytes，修改编码方式：response.content.decode("utf8")
# print(res.json())
# print(res.encoding)
# print(res.url)
# print(res.cookies)
# print(res.request.headers)
# print(res.headers)
# print(res.status_code)
# print(res.ok) # status_code<200时True

# 获取html页面通用方式
# print(res.content.decode()) # 推荐
# print(res.content.decode('UTF-8'))
# print(res.text)


# requests
# # 下载图片
# import requests
# url = ''
# headers={}
# kw = {}
# res = requests.get(url, params=kw, headers=headers, proxies=proxies) # 请求 
# # print(res.content.decode('UTF-8'))
# with open('a.jpg', 'wb') as f:
#   f.write(res.content) # 写入

# # requests发送post
# import requests
# headers={}
# data={}
# res = requests.post(url, headers=headers,data=data)
# print(res.json())

# # 抓取小米商店应用
# import requests
# from lxml import etree
# url = ''
# headers={
#   'user-agent': ''
# }
# res = requests.get(url, headers=headers)
# content = res.content.decode()
# tree = etree.HTML(content)
# # app_name = tree.xpath('//ul[@class="applist"]/li/h5/a/text()')
# # app_name = tree.xpath('//ul[@class="applist"]/li/h5/a/@href')
# a_list = tree.xpath('//ul[@class="applist"]/li/h5/a')
# for a in a_list:
#   print(a.xpath('./text()'))
#   print(a.xpath('./@href'))

# # 代理
# # 防止真实地址被泄露，模拟不同客户端
# # 正向代理：客户端与代理在同一局域网，隐藏了真实请求客户端，如VPN，服务器不知道真实的客户端是谁
# # 反向代理：服务器和代理在同一局域网，隐藏了真实服务器，如nginx，客户端不知道真正提供服务的是谁
# 代理平台：https://www.kuaidaili.com/free
# import requests
# proxy = [
#   {'http': 'http://58.246.58.150:9002'},
#   {'http': 'http://36.134.91.82:8888'},
#   {'https': 'https://36.6.144.17:8089'}
# ]
# import random
# proxy = random.choice(proxy) # 随机选择，不要每次都使用同一个ip
# result = requests.get("http://httpbin.org/ip", proxies=proxy)
# print(result.text) # {"origin": "120.229.61.235"}

# # 自动获取解码格式+图片下载
# import requests
# res = requests.get(url, headers=headers)
# res.encoding = res.apparent_encoding
# data = res.text # data = res.content.decode('UTF-8/GBK')
# print(data)
# tree = etree.HTML(data)
# xxx = tree.xpath('')
# import time
# import os
# path = 'img'
# if not os.path.exists(path):
#   os.mkdir(path)
# i = 0
# for url in list:
#   res = requests.get(url, headers=headers)
#   with open(os.path.join(path, str(i)+'.jpg'), 'wb') as f:
#     f.write(res.content)
# i += 1
# time.sleep(1)

# for i in range(1, 6):
#   url = f'xxx.${i}.html'
#   print(url)

# total_num = int(re.search('var countPage = (?P<page>\d+)//共多少页', data, 'page'))
# pageNum = int(input('请输入要抓取的页码数：'))
# if pageNum < 0 or pageNum > total_num:
#   print('请输入正确的页码')
# else:
#   for i in range(pageNum):
#     url = f'${i}'
#     if i == 0:
#       url = ''
#     get_page(url)


# 异步加载-加载更多
# import requests
# headers={}
# res = requests.get(url, headers=headers)
# data={}
# res = requests.post(url, headers=headers,data=data)
# print(res.json())

# 携带cookie登录雪球网  抓取完善个人资料页面
# import requests
# headers = {
#     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
#     'Referer': 'https://xueqiu.com/',
#     'Host': 'xueqiu.com',
# }
# url = 'https://xueqiu.com/'
# res = requests.get(url, headers=headers)
# cookies = res.cookies
# # print(dict(cookies))
# listurl = 'https://stock.xueqiu.com/v5/stock/portfolio/stock/list.json?size=1000&category=2&pid=-110'
# response = requests.get(listurl, headers=headers, cookies=cookies)
# print(response.status_code) # 200

# # 用Session代替cookie
# import requests
# headers = {
#     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
#     'Referer': 'https://xueqiu.com/',
#     'Host': 'xueqiu.com',
# }
# url = 'https://xueqiu.com/'
# session = requests.Session()
# session.get(url=url, headers=headers)
# listUrl = 'https://xueqiu.com/upload/web?category=web_behavior'
# res = session.post(listUrl, headers=headers)
# print(res) # <Response [200]>
# print(res.json()) # {'isSuccess': False, 'retCode': -1}


# 破解验证码 - http://www.ttshitu.com/docs/index.html?spm=null
# import requests
# code_url = 'https://so.gushiwen.cn/RandCode,ashx'
# headers = {}
# res = requests.get(code_url, headers=headers)
# with open('xxx.jpg', 'wb') as f:
#   f.write(res.content)
# img_path = './xxx.jpg'
# result = base64_api(uname='', pwd='', img=img_path, typeid=3)
# print(result)

